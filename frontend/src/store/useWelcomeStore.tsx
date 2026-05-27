import { ConfirmResult, LoginUserForm, User } from "@/type/User";
import { create } from "zustand";

const baseUrl = "http://localhost:8080/api/user";

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
        // const response = await fetch(`${baseUrl}`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(user)
        // });

        // if (!response.ok) throw new Error("존재하지 않는 회원정보입니다.");
        // const loginUserProfile = await response.json();
        
        // set({ user: loginUserProfile });
    },
    logoutUser: () => set({ user: null }),

    joinUser: async (userFormData) => {
        try {
            const response = await fetch(`${baseUrl}`)
        } catch (err) {
            console.error(`joinUser 실패: ${err}`);
        }
    },
    confirmData: async (type, value) => {
        const typeText = type === "userId" ? "아이디" : "닉네임";
        // const response = await fetch(`${baseUrl}?${type}=${value}`, {
        //     method: "GET",
        //     headers: { "Content-Type": "application/json" },
        // });
        // if (!response.ok) throw new Error("서버 통신에 실패했습니다.");
        // // { isDuplicated: true/false }
        // const data = await response.json();

        // return { typeText, value, isDuplicated: data.isDuplicated };
        return { typeText, value, isDuplicated: true };
    }
}));