'use client';

import { useState } from "react";
import { DOMAIN_STYLES } from "@/app/constance/activityOptions";

function PlanItem({ plan, key }: any) {
    // 💡 1. 체크박스 상태를 PlanItem 내부에서 바로 관리합니다.
    const [isChecked, setIsChecked] = useState(false);

    const domains: string[] = Array.from(
        new Set(plan.plans.map((item: any) => item.domain))
    );

    return (
        // 💡 팁: 체크되었을 때 카드 전체에 하이라이트 테두리를 주고 싶다면 아래처럼 활용도 가능합니다!
        // `border-solid ${isChecked ? 'border-main shadow-md' : 'border-transparent'}`
        <div className="rounded-[2.4rem] bg-bgCard hover:-top-[.5rem] relative cursor-pointer transition-all duration-200 border border-solid border-[#eee] shadow-sm overflow-hidden">
            
            {/* 상단 그라디언트 구역 */}
            <div className="bg-sub2-gradient p-[1.6rem] relative">
                <p className="text-textLight text-[1.8rem] font-semibold mb-[1rem]">{plan.mainTheme}</p>
                <ul className="flex gap-[.4rem]">
                    <li className="flex items-center text-[1.4rem] text-textLight">{plan.age}</li>
                    <li className="before:content-['•'] before:mr-[.4rem] flex items-center text-[1.4rem] text-textLight">{plan.plans.length}개 활동</li>
                </ul>

                {/* 🎨 2. 커스텀 체크박스 영역 구현 */}
                <label className="absolute top-[1.6rem] right-[1.6rem] cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        value={key} 
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                        className="peer hidden" 
                    />
                    {/* 눈에 보이는 커스텀 체크박스 (기본 백그라운드 border 선언) */}
                    <div className="w-[2.2rem] h-[2.2rem] rounded-[0.6rem] border-[0.15rem] border-solid border-white/60 bg-transparent flex items-center justify-center transition-all duration-200
                        hover:border-white
                        peer-checked:bg-white peer-checked:border-white"
                    >
                        {/* 체크되었을 때 나타날 V자 아이콘 (그라디언트 배경 위라 체크 시 메인컬러나 어두운 컬러 텍스트 추천) */}
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

            {/* 하단 도메인 태그 구역 */}
            <div className="p-[1.6rem]">
                <ul className="flex gap-[.4rem] items-center flex-wrap">
                    {domains.map((domain, idx) => {
                        // 💡 Fallback 기본 스타일 지정
                        const domainStyle = DOMAIN_STYLES[domain] || "bg-gray-100 text-gray-600";
                        return (
                            <li 
                                key={idx} 
                                className={`${domainStyle} p-[.4rem_.8rem] rounded-[60rem] text-[1.4rem] font-semibold border border-solid`}
                            >
                                {domain}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default PlanItem;