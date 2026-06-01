import { create } from "zustand";
import { mockPlanData } from "../mock/PlanData";
import { API_ROUTES } from "@/constants/api";
import { GenerateAIPlanForm, Plan } from "@/type/Plan";

interface PlanStore {
    planStorage: Plan[];

    addPlanStorage: (plan: GenerateAIPlanForm) => Promise<void>;
    deleteSelectedPlans: (ids: number[]) => void;
    updatePlan: (plan: Plan) => Promise<void>;
};

export const usePlanStore = create<PlanStore>((set) => ({
    planStorage: mockPlanData,

    addPlanStorage: async (plan) => {
        try {
            const response = await fetch(`${API_ROUTES.PLAN.BASE}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(plan),
            });

            if (!response.ok) throw new Error("계획안 업데이트 실패");

            const planData = await response.json();

            console.log(`planData: ${planData}`);

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
            const response = await fetch(`${API_ROUTES.PLAN.DETAIL(plan.id)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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