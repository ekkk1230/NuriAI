'use client';

import { useState } from "react";
import { DOMAIN_STYLES, TYPE_STYLES, KEYWORD_STYLES } from "@/constants/activityOptions"
import { FaRegCalendarAlt, FaPen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

interface PlanItemProps {
    plan: any;
    checkHandle: (id: number) => void;
    onClick?: () => void;
};

function PlanItem({ plan, checkHandle, onClick }: PlanItemProps) {
    const [isChecked, setIsChecked] = useState(false);

    const getActivityStyle = (type: string) => {
        if (!type) return "bg-[#f1f3f5] text-[#495057]";

        if (type.includes("이야기") || type.includes("언어")) return KEYWORD_STYLES.보라;
        if (type.includes("동화") || type.includes("동시") || type.includes("동극") || type.includes("역할") || type.includes("쌓기")) return KEYWORD_STYLES.주황;
        if (type.includes("노래") || type.includes("음률") || type.includes("음악")) return KEYWORD_STYLES.민트;
        if (type.includes("신체") || type.includes("게임") || type.includes("대근육") || type.includes("수") || type.includes("조작")) return KEYWORD_STYLES.파랑;
        if (type.includes("과학") || type.includes("요리") || type.includes("탐색") || type.includes("소근육")) return KEYWORD_STYLES.갈색;
        if (type.includes("미술")) return KEYWORD_STYLES.핑크;

        return "bg-[#f1f3f5] text-[#495057]"; 
    };

    const uitilBtnClass = "p-[1rem_0.8rem] rounded-[0.8rem] flex-1 flex items-center justify-center";

    return (
        <div className="rounded-[2.4rem] bg-bgCard hover:-top-[.5rem] relative cursor-pointer transition-all duration-200 border border-solid border-[#eee] shadow-sm overflow-hidden" onClick={onClick}>
            
            <div className="bg-sub2-gradient p-[1.6rem] relative">
                <p className="text-textLight text-[1.8rem] font-semibold mb-[1rem]">{plan.mainTheme}</p>
                <ul className="flex gap-[.4rem]">
                    <li className="flex items-center text-[1.4rem] text-textLight">
                        <FaRegCalendarAlt className="mr-[.4rem]" />
                        {plan.createdAt.split('T')[0]}
                    </li>
                    <li className="before:content-['•'] before:mr-[.4rem] flex items-center text-[1.4rem] text-textLight">{plan.age}</li>
                    <li className="before:content-['•'] before:mr-[.4rem] flex items-center text-[1.4rem] text-textLight">{plan.plans.length}개 활동</li>
                </ul>

                <label className="absolute top-[1.6rem] right-[1.6rem] cursor-pointer select-none" onClick={e => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        value={plan.id} 
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        onClick={() => checkHandle(plan.id)}
                        className="peer hidden" 
                    />
                    <div className="w-[2.2rem] h-[2.2rem] rounded-[0.6rem] border-[0.15rem] border-solid border-white/60 bg-transparent flex items-center justify-center transition-all duration-200
                        hover:border-white
                        peer-checked:bg-white peer-checked:border-white"
                    >
                        <svg 
                            className={`w-[1.2rem] h-[1.2rem] text-main font-bold transition-all duration-200 ${
                                isChecked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`}
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3.5" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                </label>
            </div>

            <div className="p-[1.6rem] flex flex-col gap-[1.2rem]">
    
                <div className="flex flex-col gap-[0.8rem] h-[12rem] overflow-hidden">
                    {plan.plans.map((item: any, idx: number) => {

                        const groupStyle = item.groupType === "대집단"
                            ? "bg-[var(--color-act0)] text-[var(--color-act0-text)] border-[var(--color-act0-text)]/20"
                            : "bg-[var(--color-act1)] text-[var(--color-act1-text)] border-[var(--color-act1-text)]/20";

                        // 2. 누리과정 5대 영역 스타일 (의사소통, 신체운동 등)
                        const domainStyle = DOMAIN_STYLES[item.domain] || "bg-gray-100 text-gray-600 border-gray-200";
                        // console.log("domainStyle:", domainStyle)
                        // 3. 세부 활동 유형 (이야기 나누기, 신체표현 등) 스타일 매핑
                        const typeStyle = TYPE_STYLES[item.activityType] || "bg-[#f1f3f5] text-[#495057] border-[#e9ecef]";

                        return (
                            <div 
                                key={idx} 
                                className="flex flex-wrap items-center gap-[0.8rem] text-[1.4rem] border-b border-solid border-[#eee] last:border-none pb-[0.8rem] last:pb-0"
                            >
                                <span className={`${groupStyle} text-[1.1rem] font-bold p-[0.2rem_0.6rem] rounded-[0.4rem] shrink-0 min-w-[5.2rem] text-center border border-solid`}>
                                    {item.groupType}
                                </span>

                                <span className={`${domainStyle} text-[1.1rem] font-bold p-[0.2rem_0.6rem] rounded-[0.4rem] shrink-0 min-w-[5.2rem] text-center border border-solid`}>
                                    {item.domain}
                                </span>

                                <span className={`${getActivityStyle(item.activityType)} text-[1.1rem] font-semibold p-[0.2rem_0.6rem] rounded-[0.4rem] shrink-0 border border-solid`}>
                                    {item.activityType}
                                </span>

                                <p className="font-medium w-[100%] text-[1.4rem] font-semibold truncate">
                                    {item.activityName}
                                </p>


                                <div className="mt-[.8rem] flex gap-[.4rem] w-full">
                                    <button type="button" className={`${uitilBtnClass} bg-blue-200 hover:bg-blue-300 text-blue-600`}><FaPen /></button>
                                    <button type="button" className={`${uitilBtnClass} bg-red-200 hover:bg-red-300 text-red-600`}><MdDelete /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    )
}

export default PlanItem;