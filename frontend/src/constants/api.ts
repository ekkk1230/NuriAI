import { Plan } from "@/type/Plan";
import { User } from "@/type/User";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const API_ROUTES = {
    USER: {
        BASE: `${API_BASE_URL}/api/users`,
    },
    PLAN: {
        BASE: `${API_BASE_URL}/api/plans`,
        DETAIL: (planId: number | string) => `${API_BASE_URL}/api/plans/${planId}`,
        USER: (user: User) => `${API_BASE_URL}/api/plans/user/${user.userNickname}`,
        AUTHOR: (plan: Plan) => `${API_BASE_URL}/api/plans/author/${plan.author}`,
        LIKE: (planId: number) => `${API_BASE_URL}/api/plans/${planId}/like`,
        SAVE: (planId: number) => `${API_BASE_URL}/api/plans/${planId}/save`,
    }
} as const;