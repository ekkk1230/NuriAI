import { ConfirmResult, LoginUserForm, User } from "@/type/User";
import { API_ROUTES } from "@/constants/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch } from "@/util/api";

interface WelcomeStore {
    user: User | null,
    fetchUserInfo: () => Promise<void>;
    loginUser: (user: LoginUserForm) => Promise<void>;
    logoutUser: () => void;

    joinUser: (userFormData: User) => Promise<void>;
    confirmData: (type: string, value: string) => Promise<ConfirmResult>;
};

export const useWelcomeStore = create<WelcomeStore>()(
    persist(
        (set) => ({
            user: null,
            fetchUserInfo: async () => {
                const token = localStorage.getItem("accessToken");
                if (!token) return;
        
                const response = await apiFetch(`${API_ROUTES.USER.BASE}/me`);
                
                if (response.ok) {
                    const userData = await response.json();
                    set({ user: userData });
                } else {
                    localStorage.removeItem("accessToken");
                }
            },
            loginUser: async(user: LoginUserForm) => {
                try {
                    const response = await fetch(`${API_ROUTES.USER.BASE}/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(user),
                    });
        
                    if (!response.ok) throw new Error("로그인에 실패했습니다");
                    const data = await response.json();
        
                    if (data.accessToken) {
                        localStorage.setItem("accessToken", data.accessToken);
                        set({ user: data.user }); 
                    } else {
                        throw new Error("서버에서 토큰을 받지 못했습니다.");
                    }
                } catch (err) {
                    // console.error(`loginUser 실패: ${err}`);
                    throw err;
                };
            },
            logoutUser: () => set({ user: null }),
        
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
            }
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);