import { useWelcomeStore } from "@/store/useWelcomeStore";

export const useFindForm = () => {
    const { findUserId, findUserPwd } = useWelcomeStore();

    const findIdApi = async (email: string) => {
        return await findUserId(email);
    };

    const findPwdApi = async (userId: string, email: string) => {
        return await findUserPwd(userId, email);
        // console.log(userId, email)
    };

    return {
        findIdApi, findPwdApi
    };
}