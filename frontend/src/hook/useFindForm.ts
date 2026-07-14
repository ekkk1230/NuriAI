import { useWelcomeStore } from "@/store/useWelcomeStore";

export const useFindForm = () => {
    const { findUserId } = useWelcomeStore();

    const findIdApi = async (email: string) => {
        return await findUserId(email);
    };

    const findPwdApi = (userId: string, email: string) => {
        // console.log(userId, email)
    };

    return {
        findIdApi, findPwdApi
    };
}