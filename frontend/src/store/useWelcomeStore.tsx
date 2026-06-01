import { ConfirmResult, LoginUserForm, User } from "@/type/User";
import { API_ROUTES } from "@/constants/api";
import { create } from "zustand";

interface WelcomeStore {
    user: User | null,
    loginUser: (user: LoginUserForm) => Promise<void>;
    logoutUser: () => void;

    joinUser: (userFormData: User) => Promise<void>;
    confirmData: (type: string, value: string) => Promise<ConfirmResult>;
};

export const useWelcomeStore = create<WelcomeStore>((set) => ({
    user: null,
    loginUser: async(user) => {
        try {
            const response = await fetch(`${API_ROUTES.USER.BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            // if (!response.ok) throw new Error("존재하지 않는 회원정보 입니다.");
            const loginUser = await response.json();

            set({ user: loginUser });
        } catch (err) {
            // console.error(`loginUser 실패: ${err}`);
            throw err;
        };
    },
    logoutUser: () => set({ user: null }),

    joinUser: async (userFormData) => {
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
    confirmData: async (type, value) => {
        const typeText = type === "userId" ? "아이디" : "닉네임";

        const response = await fetch(`${API_ROUTES.USER.BASE}/${type}/${value}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("서버 통신에 실패앴습니다.");
        const isDuplicated = await response.json();
    
        return { typeText, value, isDuplicated };
    }
}));