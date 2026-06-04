import { create } from "zustand";
import { API_ROUTES } from "@/constants/api";
import { GenerateAIPlanForm, Plan } from "@/type/Plan";
import { apiFetch } from "@/util/api";
import { User } from "@/type/User";

interface PlanStore {
    planStorage: Plan[];
    isLoaded: boolean;
    currentCreatePlan: Plan[];
    fetchAllPlans: () => Promise<void>;
    fetchPlanById: (id: number) => Promise<void>;
    fetchUserPlans: (user: User)  => Promise<void>;
    fetchPlansByAuthor: (plan: Plan) => Promise<void>;
    userPlans: Plan[];
    authorPlans: Plan[];
    addPlan: (plan: GenerateAIPlanForm) => Promise<void>;
    deleteSelectedPlans: (ids: number[]) => void;
    updatePlan: (plan: Plan) => Promise<void>;
    likePlan: (user: User, plan: Plan) => Promise<void>;
    addStorage: (user: User, plan: Plan) => Promise<void>;
};

export const usePlanStore = create<PlanStore>((set, get) => ({
    planStorage: [],
    isLoaded: false,
    fetchAllPlans: async () => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.BASE}`); 
            // console.log("응답 상태:", response.status);
            if (!response.ok) throw new Error("전체 목록 조회 실패");
            const data = await response.json();
            // console.log("가져온 데이터:", data);
            set({ planStorage: Array.isArray(data) ? data : [data], isLoaded: true });
        } catch (err) {
            console.error(err);
            set({ isLoaded: true });
        }
    },

    fetchPlanById: async (id: number) => {
        const url = API_ROUTES.PLAN.DETAIL(id);
        // console.log("생성된 URL:", url);
        try {
            const response = await apiFetch(url);
            if (!response.ok) throw new Error("단일 계획안 조회 실패");
            const planData = await response.json();
            
            set(state => ({
                planStorage: state.planStorage.find(p => p.id === id)
                    ? state.planStorage.map(p => p.id === id ? planData : p)
                    : [planData, ...state.planStorage]
            }));
        } catch (err) {
            console.error(`fetchPlanById 실패: ${err}`);
        }
    },
    fetchUserPlans: async (user) => {
        const url = API_ROUTES.PLAN.USER(user);
        try {
            const response = await apiFetch(url);
            if (!response.ok) throw new Error("사용자 계획안 조회 실패");
            const planData = await response.json();

            set({ 
                userPlans: Array.isArray(planData) ? planData : [planData],
                isLoaded: true 
            });
        } catch (err) {
            console.error(`fetchUserPlans 실패: ${err}`);
            set({ isLoaded: true }); 
        }
    },
    fetchPlansByAuthor: async (plan) => {
        const url = API_ROUTES.PLAN.AUTHOR(plan);
        try {
            const response = await apiFetch(url);
            // console.log("작성자 계획안 응답 상태:", response.status);
            if (!response.ok) throw new Error("사용자 계획안 조회 실패");
            const planData = await response.json();
            // console.log("작성자 계획안 데이터:", planData);

            set({ 
                authorPlans: Array.isArray(planData) ? planData : [planData],
                isLoaded: true 
            });
        } catch (err) {
            console.error(`fetchPlansByAuthor 실패: ${err}`);
            set({ isLoaded: true }); 
        }
    },
    userPlans: [],
    authorPlans: [],
    currentCreatePlan: [],
    addPlan: async (plan) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.BASE}/generate`, {
                method: "POST",
                body: JSON.stringify(plan),
            });

            if (!response.ok) throw new Error("계획안 업데이트 실패");

            const planData = await response.json();

            // console.log("planData:", planData);

            set(state => ({ 
                planStorage: [planData, ...state.planStorage],
                currentCreatePlan: [planData, ...state.planStorage],
            }));
        } catch (err) {
            console.error(`addPlan 실패: ${err}`);
        }
    },
    deleteSelectedPlans: (ids) => set(state => ({
        planStorage: state.planStorage.filter(p => !ids.includes(p.id))
    })),
    updatePlan: async (plan) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.DETAIL(plan.id)}`, {
                method: "POST",
                body: JSON.stringify(plan),
            })

            if (!response.ok) throw new Error("계획안 업데이트 실패");

            const planData = await response.json();

            set(state => ({ 
                planStorage: state.planStorage.map(p => p.id === planData.id ? { ...planData } : p)
            }))
        } catch (err) {
            console.error(`updatePlan 실패: ${err}`);
        }
    },
    likePlan: async(user, plan) => {
        // console.log(`${API_ROUTES.PLAN.LIKE(plan.id)}`)
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.LIKE(plan.id)}`, {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
            });
            console.log(response)

            if (!response.ok) throw new Error("계획안 좋아요 실패");
            const likePlan = await response.json();

            set(state => ({ planStorage: state.planStorage.map(p => p.id === plan.id ? likePlan : p) }))
        } catch (err) {
            console.error(`likePlan 실패: ${err}`);
        }
    },
    addStorage: async(user, plan) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.SAVE(plan.id)}`, {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
            });
            if (!response.ok) throw new Error("계획안 저장 실패");
            const savePlan = await response.json();
            set(state => ({ 
                planStorage: state.planStorage.map(p => p.id === plan.id ? savePlan : p),
            }));
            
            await get().fetchUserPlans(user);
        } catch (err) {
            console.error(`addStorage 실패: ${err}`);
        }
    }
}));