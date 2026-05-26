import { create } from "zustand";
import { mockPlanData } from "../mock/PlanData";

interface PlanStore {
    planStorage: Plan[];

    addPlanStorage: (plan: Plan) => void;
    deleteSelectedPlans: (ids: number[]) => void;
    updatePlan: (plan: Plan) => void;
};

export const usePlanStore = create<PlanStore>((set) => ({
    planStorage: mockPlanData,

    addPlanStorage: (plan) => set(state => ({ planStorage: [plan, ...state.planStorage] })),
    deleteSelectedPlans: (ids) => set(state => ({
        planStorage: state.planStorage.filter(p => !ids.includes(p.id))
    })),
    updatePlan: (plan) => set(state => ({ 
        planStorage: state.planStorage.map(p => p.id === plan.id ? { ...plan } : p)
    }))
}));