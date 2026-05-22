"use client";

import { useState } from "react";
import { ACTIVITY_TYPES, AGE_OPTIONS, AREA_TYPES } from "../constance/activityOptions";
import PlanPreview from "../components/Planner/PlanPreview";
import NoPlan from "../components/Planner/NoPlan";


function page() {
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

    const writeTypeBtn = (obj: any, mode: 'type' | 'area') => {
        return (
            <div className="grid grid-cols-2 gap-[.4rem]">
                {
                    obj.map((type: string, index: number) => {
                        const uniqueValue = `${mode}-${index}`;
                        const id = index;
                        return <button className={activeAreaTypeBtnClass(uniqueValue, index, mode)} onClick={(e) => handleSelectType(e, mode)} type="button" id={`${id}`} key={index} value={`${mode}-${index}`}>{type}</button>;
                    })
                }
            </div>
        );
    };

    const handleMakeAIPlan = async() => {
        try {
            const response = await '';

            setPlan(true);
        } catch (err) {
            console.error(`handleMakeAIPlan 실패: ${err}`);
            setPlan(false);
        }
    }

    return (
        <div className="flex h-[100%] min-h-[100%]">
            <div className="border-r-[.1rem] border-solid border-[#eee] w-[40rem] h-[100%] p-[2rem]">
                <p className="text-[2.6rem] font-bold mb-5">설정</p>

                <form className="space-y-[2rem] mb-[6rem]">
                    <div className="flex flex-col">
                        <label htmlFor="topic" className="font-medium text-[1.6rem] mb-[1.2rem]">
                            주제 <span className="text-[#ad46ff]">*</span>
                        </label>
                        <input type="text" id="topic" placeholder="주제를 입력해주세요." />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="topic" className="font-medium text-[1.6rem] mb-[1.2rem]">
                            대상연령 <span className="text-[#ad46ff]">*</span>
                        </label>
                        <div className="flex gap-[.4rem] flex-wrap">
                            {AGE_OPTIONS.map(op => (
                                <button type="button" key={op.value} value={op.value} onClick={() => setActiveAge(op.value)} className={activeAgeBtnClass(op.value)}>{op.label}</button>
                            ))}
                        </div>
                    </div>

                    {activeAge !== null && activeAge >= 3 && (
                        <div className="flex flex-col">
                            <label htmlFor="activity-form" className="font-medium text-[1.6rem] mb-[1.2rem]">
                                활동 형태 <span className="text-[#ad46ff]">*</span>
                            </label>
                            
                            <div className="flex gap-[.4rem]">
                                <button type="button" onClick={() => handleSelectFormat("large")} className={activeFormBtnClass("large")}>대집단</button>
                                <button type="button" onClick={() => handleSelectFormat("small")} className={activeFormBtnClass("small")}>소집단</button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="activity-type" className="font-medium text-[1.6rem] mb-[1.2rem]">
                            활동 유형 (중복 선택 가능)<span className="text-[#ad46ff]">*</span>
                        </label>
                        
                        {activeForm === "large" ? (
                            writeTypeBtn(ACTIVITY_TYPES, 'type')
                        ) : (
                            writeTypeBtn(AREA_TYPES, 'area')
                        )}
                    </div>
                
                    <button type="button" className="p-[1rem] w-[100%] flex justify-center bg-sub-gradient rounded-[.8rem] text-textLight text-2xl font-bold mb-[2rem]"
                        onClick={handleMakeAIPlan}
                    >AI 계획안 생성하기</button>
                </form>

                <div className="border-[0.2rem] border-solid border-[#a5d8ff] bg-[#92c8f233] p-[1rem] rounded-[1.2rem]">
                    <p className="text-[1.4rem] font-semibold mb-[1rem] text-[#113d90]">사용 팁</p>
                    <ul className="space-y-1">
                        <li className="text-[#113d90] text-[1.2rem]">만 0-2세는 소집단 영역 활동만 가능합니다.</li>
                        <li className="text-[#113d90] text-[1.2rem]">만 3-5세는 대집단/소집단 선택 가능합니다.</li>
                        <li className="text-[#113d90] text-[1.2rem]">여러 항목 선택 시 통합 활동 세트 생성</li>
                        <li className="text-[#113d90] text-[1.2rem]">생성 후 각 활동 클릭으로 직접 수정 가능</li>
                    </ul>
                </div>
            </div>
            
            <div className="w-[100%] bg-bgPreview">
                {plan ? (
                    <PlanPreview />
                ) : (
                    <NoPlan />
                )}
            </div>
        </div>
    )
}
export default page