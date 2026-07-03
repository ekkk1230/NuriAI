import { usePlanStore } from "@/store/usePlanStore";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { GenerateAIPlanForm } from "@/type/Plan"
import { useForm } from "./useForm";
import { useState } from "react";
import { ACTIVITY_OPTIONS } from "@/constants/activityOptions";

const initialPlanDataForm: GenerateAIPlanForm = {
    mainTheme: "",
    age: null,
    selections: [],
    groupType: ""
};

export const useWorkspace = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useWelcomeStore();
    const { addPlan } = usePlanStore();
    const { form: planForm, handleChange } = useForm<GenerateAIPlanForm>(initialPlanDataForm);

    const [plan, setPlan] = useState<boolean>(false);
    const [activeAge, setActiveAge] = useState<number | null>(null);
    const [activeForm, setActiveForm] = useState<string | null>("small");
    const [activeType, setActiveType] = useState<string[]>([]);
    const [areaType, setAreaType] = useState<string[]>([]);

    const baseBtnClass = "flex-1 rounded-[0.8rem] text-textLight text-[1.4rem] font-semibold text-center transition-all duration-200 shadow-sm whitespace-nowrap";
    const baseTypeBtnClass = "w-[100%] border-[.2rem] border-solid border-[#eee] rounded-[60rem] p-[1.2rem_0] text-center whitespace-nowrap text-[1.4rem] font-semibold"

    const activeAgeBtnClass = (value: number) => {
        const isActive = activeAge === value;
        const bgClass = isActive ? "bg-[#07726f]" : "bg-disabled hover:bg-hoverDisabled";
        return `${baseBtnClass} ${bgClass} p-[1rem_1.6rem]`;
    };

    const activeFormBtnClass = (value: string) => {
        const isActive = activeForm === value;
        const bgClass = isActive ? "bg-main" : "bg-disabled hover:bg-hoverDisabled";
        return `${baseBtnClass} ${bgClass} p-[1rem]`;
    };

    const handleSelectFormat = (value: string) => setActiveForm(value);

    const handleSelectType = (e: any, mode: 'type' | 'area') => {
        const tgValue = e.target.value;
        if (mode === "type") {
            setActiveType(prev => 
                prev.includes(tgValue) ? prev.filter(item => item !== tgValue) : [...prev, tgValue]
            );
        } else {
            setAreaType(prev => 
                prev.includes(tgValue) ? prev.filter(item => item !== tgValue) : [...prev, tgValue]
            );
        }
    };

    const actBgStyles: Record<number, string> = {
        0: "bg-[var(--color-act0)]/20",
        1: "bg-[var(--color-act1)]/20",
        2: "bg-[var(--color-act2)]/20",
        3: "bg-[var(--color-act3)]/20",
        4: "bg-[var(--color-act4)]/20",
        5: "bg-[var(--color-act5)]/20",
    };

    const cateBgStyles: Record<number, string> = {
        0: "bg-[var(--color-cate0)]/20",
        1: "bg-[var(--color-cate1)]/20",
        2: "bg-[var(--color-cate2)]/20",
        3: "bg-[var(--color-cate3)]/20",
        4: "bg-[var(--color-cate4)]/20",
        5: "bg-[var(--color-cate5)]/20",
    };

    const actBorderStyles: Record<number, string> = {
        0: "border-[var(--color-act0)]",
        1: "border-[var(--color-act1)]",
        2: "border-[var(--color-act2)]",
        3: "border-[var(--color-act3)]",
        4: "border-[var(--color-act4)]",
        5: "border-[var(--color-act5)]",
    }

    const actTextStyles: Record<number, string> = {
        0: "text-[var(--color-act0-text)]",
        1: "text-[var(--color-act1-text)]",
        2: "text-[var(--color-act2-text)]",
        3: "text-[var(--color-act3-text)]",
        4: "text-[var(--color-act4-text)]",
        5: "text-[var(--color-act5-text)]",
    }

    const cateBorderStyles: Record<number, string> = {
        0: "border-[var(--color-cate0)]",
        1: "border-[var(--color-cate1)]",
        2: "border-[var(--color-cate2)]",
        3: "border-[var(--color-cate3)]",
        4: "border-[var(--color-cate4)]",
        5: "border-[var(--color-cate5)]",
    };
      
    const cateTextStyles: Record<number, string> = {
        0: "text-[var(--color-cate0-text)]",
        1: "text-[var(--color-cate1-text)]",
        2: "text-[var(--color-cate2-text)]",
        3: "text-[var(--color-cate3-text)]",
        4: "text-[var(--color-cate4-text)]",
        5: "text-[var(--color-cate5-text)]",
    };
      
    const activeAreaTypeBtnClass = (value: string, index: number, type: string) => {
        const selectTypeBg = type === 'type' ? actBgStyles : cateBgStyles;
        const selectTypeBorder = type === 'type' ? actBorderStyles : cateBorderStyles;
        const selectTypeText = type === 'type' ? actTextStyles : cateTextStyles;
        const arr = type === 'type' ? activeType : areaType;
        const exists = arr.includes(value);
        const activeStyle = exists 
            ? `border-2 ${selectTypeBorder[index]} ${selectTypeText[index]} ${selectTypeBg[index]} font-bold` 
            : "border border-solid border-[#eee] bg-white text-[#666]";
        
        return `${baseTypeBtnClass} ${activeStyle}`;
    };


    const getSelectionList = () => {
        if (activeAge !== null && activeAge < 3) return ACTIVITY_OPTIONS.INFANT;
        if (activeForm === "large") return ACTIVITY_OPTIONS.CHILD_LARGE;
        return ACTIVITY_OPTIONS.CHILD_SMALL;
    }


    const handleMakeAIPlan = async() => {
        
        const getLabel = (val: string) => {
            const [mode, indexStr] = val.split('-');
            const index = parseInt(indexStr);
           
            const currentList = getSelectionList();
            return currentList[index]
        };
    
        const selectionsLabels = (activeForm === "large" ? activeType : areaType).map(getLabel);

        // console.log("현재 user 상태:", user);
    
        const planData = {
            mainTheme: planForm.mainTheme,
            age: activeAge,
            groupType: activeForm === "large" ? "대집단" : "소집단",
            selections: selectionsLabels,
            author: user?.userNickname
        };

        // console.log('ddd')
        // console.log(planData.author)

        setIsLoading(true);

        try {
            await addPlan(planData);

            setPlan(true);
        } catch (err) {
            console.error(`handleMakeAIPlan 실패: ${err}`);
            setPlan(false);
        } finally { 
            setIsLoading(false);
        }
    }

    return {
        activeAreaTypeBtnClass, handleSelectType, handleChange,
        setActiveAge, setActiveForm, activeAgeBtnClass, activeAge,
        handleSelectFormat, activeFormBtnClass, activeForm, getSelectionList, handleMakeAIPlan, isLoading, plan
    }
    
}