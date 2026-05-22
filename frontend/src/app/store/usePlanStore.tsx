import { create } from "zustand";
import { mockPlanData } from "../mock/PlanData";

interface PlanStore {
    planStorage: Plan[];

    addPlanStorage: (plan: Plan) => void;
};

export const usePlanStore = create<PlanStore>((set) => ({
    planStorage: mockPlanData,

    addPlanStorage: (plan) => set(state => ({ planStorage: [plan, ...state.planStorage] })),
}));