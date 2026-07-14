import { ConfirmResult, LoginUserForm, User } from "@/type/User";
import { API_ROUTES } from "@/constants/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiFetch } from "@/util/api";

interface WelcomeStore {
    user: User | null,
    accessToken: string | null;
    fetchUserInfo: () => Promise<void>;
    loginUser: (user: LoginUserForm) => Promise<void>;
    logoutUser: () => void;

    joinUser: (userFormData: User) => Promise<void>;
    confirmData: (type: string, value: string) => Promise<ConfirmResult>;

    withdraw: () => Promise<void>;

    findUserId: (email: string) => Promise<string>;
    findUserPwd: (userId: string, email: string) => Promise<void>;
};

export const useWelcomeStore = create<WelcomeStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            fetchUserInfo: async () => {
                // const { accessToken } = get();
                // if (!accessToken) return;
                const token = localStorage.getItem('accessToken')
                if (!token) return;
        
                const response = await apiFetch(`${API_ROUTES.USER.BASE}/me`);
                
                if (response.ok) {
                    const userData = await response.json();
                    set({ user: userData });
                } else {
                    // set({ user: null, accessToken: null });
                    // localStorage.removeItem("accessToken");
                    console.warn("사용자 정보 로드 실패 (토큰 만료 가능성)");
                }
            },
            loginUser: async(user: LoginUserForm) => {
                // console.log(user)
                try {
                    const response = await fetch(`${API_ROUTES.USER.BASE}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(user),
                    });
                    
                    if (!response.ok) throw new Error("로그인에 실패했습니다");
                    const data = await response.json();
                    // console.log(data)
        
                    if (data.accessToken) {
                        set({ accessToken: data.accessToken, user: data.user });
                    } else {
                        throw new Error("서버에서 토큰을 받지 못했습니다.");
                    }
                } catch (err) {
                    // console.error(`loginUser 실패: ${err}`);
                    throw err;
                };
            },
            logoutUser: () => {
                localStorage.removeItem("accessToken");
                set({ user: null, accessToken: null });
            },
        
            joinUser: async (userFormData: User) => {
                try {
                    const response = await fetch(`${API_ROUTES.USER.BASE}/join`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(userFormData)
                    });
        
                    if (!response.ok) throw new Error("회원가입에 실패했습니다.");
                } catch (err) {
                    console.error(`joinUser 실패: ${err}`);
                }
            },
            confirmData: async (type: string, value: string) => {
                const typeText = type === "userId" ? "아이디" : "닉네임";
        
                const response = await fetch(`${API_ROUTES.USER.BASE}/${type}/${value}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
        
                if (!response.ok) throw new Error("서버 통신에 실패앴습니다.");
                const isDuplicated = await response.json();
            
                return { typeText, value, isDuplicated };
            },
            withdraw: async () => {
                try {
                    const response = await apiFetch(`${API_ROUTES.USER.WITHDRAW}`, {
                        method: "DELETE",
                    });
                    if (!response.ok) throw new Error("회원 탈퇴 실패");

                    set({ accessToken: null, user: null });
                    window.location.href = '/';
                } catch (err) {
                    console.error(`withdraw 실패: ${err}`)
                }
            },
            findUserId: async (email) => {
                try {
                    const response = await apiFetch(`${API_ROUTES.USER.FINDUSERDATA("id")}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });

                    if (!response.ok) throw new Error("아이디 찾기에 실패했습니다.");
                    const data = await response.json();
                    return data.userId;
                } catch (err) {
                    console.error(`findUserId 실패: ${err}`);
                    throw err;
                }
                
            },
            findUserPwd: async (userId, email) => {
                try {
                    const response = await apiFetch(`${API_ROUTES.USER.FINDUSERDATA("password")}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId, email }),
                    });

                    if (!response.ok) throw new Error("비밀번호 찾기에 실패했습니다.");
                    const data = await response.json();
                    console.log(data)
                } catch (err) {
                    console.error(`findUserPwd 실패: ${err}`);
                }
            }
        }) as WelcomeStore,
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
        }
    )
);