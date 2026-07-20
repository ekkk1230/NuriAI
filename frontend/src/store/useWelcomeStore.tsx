import { ConfirmResult, LoginUserForm, User } from "@/type/User";
import { API_ROUTES } from "@/constants/api";
import { create, StateCreator } from "zustand"; // StateCreator 추가
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { apiFetch } from "@/util/api";

interface WelcomeStore {
    user: User | null;
    accessToken: string | null;
    fetchUserInfo: () => Promise<void>;
    loginUser: (user: LoginUserForm) => Promise<void>;
    logoutUser: () => void;
    joinUser: (userFormData: User) => Promise<void>;
    confirmData: (type: string, value: string) => Promise<ConfirmResult>;
    withdraw: () => Promise<void>;
    findUserId: (email: string) => Promise<string>;
    findUserPwd: (userId: string, email: string) => Promise<string>;
    checkUserPwd: (password: string) => Promise<boolean>;
    changePwd: (password: string) => Promise<boolean>;
}

// 1. 상태 생성 함수를 별도로 정의하여 타입 에러를 방지합니다.
const storeCreator: StateCreator<WelcomeStore, [], []> = (set, get) => ({
    user: null,
    accessToken: null,
    
    fetchUserInfo: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;

        const response = await apiFetch(`${API_ROUTES.USER.BASE}/me`);
        if (response.ok) {
            const userData = await response.json();
            set({ user: userData });
        } else {
            console.warn("사용자 정보 로드 실패");
        }
    },
    
    loginUser: async (user: LoginUserForm) => {
        try {
            const response = await fetch(`${API_ROUTES.USER.BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error("로그인 실패");
            const data = await response.json();
            if (data.accessToken) {
                set({ accessToken: data.accessToken, user: data.user });
            } else {
                throw new Error("토큰 수신 실패");
            }
        } catch (err) {
            throw err;
        }
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
            if (!response.ok) throw new Error("회원가입 실패");
        } catch (err) {
            console.error(err);
        }
    },

    confirmData: async (type: string, value: string) => {
        const typeText = type === "userId" ? "아이디" : "닉네임";
        const response = await fetch(`${API_ROUTES.USER.BASE}/${type}/${value}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("통신 실패");
        const isDuplicated = await response.json();
        return { typeText, value, isDuplicated };
    },

    withdraw: async () => {
        try {
            const response = await apiFetch(`${API_ROUTES.USER.WITHDRAW}`, { method: "DELETE" });
            if (!response.ok) throw new Error("탈퇴 실패");
            set({ accessToken: null, user: null });
            window.location.href = '/';
        } catch (err) {
            console.error(err);
        }
    },

    findUserId: async (email) => {
        const response = await apiFetch(`${API_ROUTES.USER.FINDUSERDATA("id")}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error("아이디 찾기 실패");
        const data = await response.json();
        return data.result;
    },

    findUserPwd: async (userId, email) => {
        const response = await apiFetch(`${API_ROUTES.USER.FINDUSERDATA("password")}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, email }),
        });
        if (!response.ok) throw new Error("비밀번호 찾기 실패");
        const data = await response.json();
        return data.result;
    },

    checkUserPwd: async (password) => {
        try {
            const response = await apiFetch(`${API_ROUTES.USER.CHECKUSERPWD}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password })
            });
            return response.ok;
        } catch {
            return false;
        }
    },

    changePwd: async (password) => {
        try {
            const response = await apiFetch(`${API_ROUTES.USER.CHANGEPWD}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword: password })
            });
            return response.ok;
        } catch {
            return false;
        }
    }
});

// 2. 최종 스토어 생성
export const useWelcomeStore = create<WelcomeStore>()(
    persist(storeCreator, {
        name: 'user-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    })
);