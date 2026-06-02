import { create } from "zustand";
import { mockPlanData } from "../mock/PlanData";
import { API_ROUTES } from "@/constants/api";
import { GenerateAIPlanForm, Plan } from "@/type/Plan";
import { apiFetch } from "@/util/api";

interface PlanStore {
    planStorage: Plan[];
    isLoaded: boolean;
    fetchAllPlans: () => Promise<void>;
    fetchPlanById: (id: number) => Promise<void>;
    addPlanStorage: (plan: GenerateAIPlanForm) => Promise<void>;
    deleteSelectedPlans: (ids: number[]) => void;
    updatePlan: (plan: Plan) => Promise<void>;
};

export const usePlanStore = create<PlanStore>((set) => ({
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
        console.log("생성된 URL:", url);
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
            console.error(err);
        }
    },

    addPlanStorage: async (plan) => {
        try {
            const response = await apiFetch(`${API_ROUTES.PLAN.BASE}/generate`, {
                method: "POST",
                body: JSON.stringify(plan),
            });

            if (!response.ok) throw new Error("계획안 업데이트 실패");

            const planData = await response.json();

            console.log("planData:", planData);

            set(state => ({ planStorage: [planData, ...state.planStorage] }));
        } catch (err) {
            console.error(`addPlanStorage 실패: ${err}`);
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
}));