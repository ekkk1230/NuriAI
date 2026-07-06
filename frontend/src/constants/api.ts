import { Plan } from "@/type/Plan";
import { User } from "@/type/User";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const API_ROUTES = {
    USER: {
        BASE: `${API_BASE_URL}/api/users`,
    },
    PLAN: {
        BASE: `${API_BASE_URL}/api/plans`,
        USER: (user: User) => `${API_BASE_URL}/api/plans/user/${user.userNickname}`,
        DETAIL: (planId: number | string) => `${API_BASE_URL}/api/plans/${planId}`,
        AUTHOR: (plan: Plan) => `${API_BASE_URL}/api/plans/author/${plan.author}`,
        LIKE: (planId: number) => `${API_BASE_URL}/api/plans/${planId}/like`,
        SAVE: (planId: number) => `${API_BASE_URL}/api/plans/${planId}/save`,
        VIEW: (planId: number) => `${API_BASE_URL}/api/plans/${planId}/view`,
        COLLECTED: (userId: number) => `${API_BASE_URL}/api/plans/user/${userId}/collected`,
        UPDATE: `${API_BASE_URL}/api/plans/update`,
        DELETEMYITEMS: `${API_BASE_URL}/api/plans/delete-batch`,
    },
    INQUIRY: {
        BASE: `${API_BASE_URL}/api/inquiries`,
        UPDATE: (inquiryId: number) => `${API_BASE_URL}/api/inquiries/${inquiryId}`,
        DELETE: (inquiryId: number) => `${API_BASE_URL}/api/inquiries/${inquiryId}`,
        INSERT_ANSWER: (inquiryId: number) => `${API_BASE_URL}/api/inquiries/${inquiryId}/answer`,
        UPDATE_ANSWER: (inquiryId: number) => `${API_BASE_URL}/api/inquiries/${inquiryId}/answer`,
        DELETE_ANSWER: (inquiryId: number) => `${API_BASE_URL}/api/inquiries/${inquiryId}/answer`,
    }
} as const;