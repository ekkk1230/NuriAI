"use client";

import { useParams } from 'next/navigation';
import { usePlanStore } from '@/store/usePlanStore'; 
import { IoArrowBackOutline } from "react-icons/io5";
import { DOMAIN_STYLES } from '@/constance/activityOptions';
import { useEffect, useState } from 'react';

function page() {
    const { id: planId } = useParams();
    const { planStorage } = usePlanStore();
    
    const plan = planStorage.find(p => p.id === Number(planId));

    const baseBtnClass = "flex items-center text-[1.4rem] font-semibold cursor-pointer rounded-[0.8rem] p-[.8rem] min-w-[12rem] justify-center";

    const [ageGroup, setAgeGroup] = useState<string>("");

    useEffect(() => {
        if (!plan?.age) return;
        const ageMatch = plan.age.match(/\d+/);
        if (ageMatch) {
            const ageNum = parseInt(ageMatch[0], 10);
            const group = ageNum < 3 ? "영아" : "유아"; 
            setAgeGroup(group); 
        }
    }, [plan]);

    return (
        <>
            <div className="bg-bgPreview flex flex-col h-[100%]">
                <div className="bg-bgCard p-[1.6rem_0] border-b-[.1rem] border-solid border-[#eee]">
                    <div className="w-[70%] mx-auto flex justify-between ">
                        <button className="flex items-center text-[2rem] font-bold" onClick={() => window.history.back()}>
                            <IoArrowBackOutline className="mr-[1rem]" />
                            보관함으로 돌아가기
                        </button>

                        <div className="flex gap-[1rem]">
                            <button className={`${baseBtnClass} bg-[#eee] hover:bg-[#dbdbdb]`}>
                                인쇄
                            </button>
                            <button className={`${baseBtnClass} bg-blueActive hover:bg-[#1f69ca] text-textLight`}>
                                내보내기
                            </button>
                            <button className={`${baseBtnClass} bg-main hover:bg-hoverMain text-textLight`}>
                                활동 수정
                            </button>
                            <button className={`${baseBtnClass} bg-red-600 hover:bg-red-700 text-textLight`}>
                                삭제
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-[70%] mx-auto mt-[2rem] flex-1">
                    <div className="bg-sub2-gradient p-[3rem] rounded-[1.2rem] mb-[2rem]">
                        <p className="text-textLight text-[2.8rem] font-bold mb-[1.2rem]">{plan?.mainTheme}</p>
                        <p className="text-textLight text-[2rem] mb-[1.2rem]">👶 {plan?.age}</p>
                        <ul className="flex gap-[1rem]">
                            {plan?.plans.map((item: any, idx: number) => {
                                const domainStyle = DOMAIN_STYLES[item.domain];

                                return  <li key={`${item}-${idx}`} className={`${domainStyle} p-[.8rem_1.2rem] rounded-[60rem] font-semibold text-[1.2rem]`}>{item.domain}</li>
                            })}
                        </ul>
                    </div>

                    <div className="bg-bgCard rounded-[1.2rem] mb-[2rem] shadow-sm p-[3rem]">
                        <p className="text-[2.4rem] font-bold mb-[1rem]">활동 개요</p>
                        <div className="text-[1.6rem] text-textMuted font-semibold">이 계획안은 <span className="text-blueActive font-bold">"{plan?.mainTheme}"</span> 주제로 <span className="text-blueActive font-bold">{plan?.plans.length}개</span> 교육과정 영역을 통합한 <span className="text-blueActive font-bold">{plan?.age} {ageGroup} 대상</span> 교육 계획안입니다.</div>
                    </div>

                    {plan?.plans.map((item, idx) => {
                        const domainStyle = DOMAIN_STYLES[item.domain];
                        return (
                            <div 
                                key={idx}
                                style={{ '--domain-line-color': `var(--color-cate${item.domain === "기본생활" || item.domain === "기본생활·신체" ? 0 : item.domain === "신체운동" || item.domain === "신체운동·건강" ? 1 : item.domain === "의사소통" ? 2 : item.domain === "사회관계" ? 3 : item.domain === "예술경험" ? 4 : 5})` } as React.CSSProperties}
                                className="relative bg-bgCard rounded-[1.2rem] mb-[2rem] shadow-sm p-[3rem_3rem_3rem_4.5rem] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[.8rem] before:h-[100%] before:rounded-[1.2rem_0_0_1.2rem] before:rounded-l-[1.2rem] before:bg-[var(--domain-line-color)]"
                            >
                                <div className="flex gap-[1rem] items-center mb-[1rem]">
                                    <p className={`${domainStyle} text-[1.2rem] inline-block p-[.8rem_1.2rem] font-semibold rounded-[60rem]`}>
                                        {item.domain}
                                    </p>

                                    <span className="text-textMuted text-[1.2rem] font-semibold">활동 {idx + 1} / {plan.plans.length}</span>
                                </div>

                                <p className="text-[2.4rem] my-[2rem] font-bold">{item.activityName}</p>

                                <div className="mb-[2rem]">
                                    <p className="text-[2rem] font-semibold mb-[1rem]">기대 효과</p>
                                    <ul className="space-y-1 pl-[1rem] mb-[2.4rem]"> 
                                        {item.objectives.map((obj, idx) => (
                                            <li className="before:content-['•'] before:text-main before:mr-[.8rem] text-[1.6rem]" key={idx}>
                                                {obj}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-[2rem] font-semibold mb-[1.2rem]">연계 교육과정</p>
                                    
                                    <div className="flex flex-col gap-[1.2rem] pl-[0.4rem]">
                                        {item.relatedCurriculum.map((curriculum, idx) => {
                                            const steps = curriculum.split(/\s*>\s*/); 

                                            return (
                                                <div key={idx} className="flex flex-wrap items-center gap-[0.8rem] text-[1.4rem]">
                                                    {steps.map((step, stepIdx) => (
                                                        <div key={stepIdx} className="flex items-center gap-[0.8rem]">
                                                            <span className={`p-[0.4rem_1.2rem] rounded-[0.8rem] font-semibold tracking-tight ${
                                                                stepIdx === 0 
                                                                    ? 'bg-blueActive/10 text-blueActive'
                                                                    : 'bg-[#f8f9fa] border border-solid border-[#eee] text-textMuted font-medium' 
                                                            }`}>
                                                                {step}
                                                            </span>
                                                            
                                                            {stepIdx < steps.length - 1 && (
                                                                <span className="text-[#bbb] text-[1.2rem] font-normal font-mono select-none">▶</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                               <div className="mb-[2rem]">
                                    <p className="text-[2rem] font-semibold mb-[1.6rem]">활동 방법</p>
                                    
                                    <div className="flex flex-col gap-[2.4rem] pl-[0.4rem] relative before:content-[''] before:absolute before:left-[1.5rem] before:top-[1rem] before:w-[0.2rem] before:h-[calc(100%-2rem)] before:bg-[#eee]">
                                        
                                        {item.content.introduction && (
                                            <div className="relative pl-[3.6rem]">
                                                <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-blueActive border-[4px] border-solid border-white shadow-sm z-10" />
                                                
                                                <div className="flex flex-col gap-[0.6rem]">
                                                    <span className="text-[1.4rem] font-bold text-blueActive">도입</span>
                                                    <p className="text-[1.6rem] text-[#333] leading-relaxed">
                                                        {item.content.introduction.split("'")[0]}
                                                    </p>
                                                    {item.content.introduction.includes("'") && (
                                                        <div className="bg-[#f4f7fa] p-[1.2rem_1.6rem] rounded-[0.8rem] text-[1.5rem] font-medium text-[#495057] italic before:content-['“'] after:content-['”'] before:text-blueActive/40 before:mr-[0.4rem] after:text-blueActive/40 after:ml-[0.4rem]">
                                                            {item.content.introduction.match(/'([^']+)'/)?.[1]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {item.content.development && (
                                            <div className="relative pl-[3.6rem]">
                                                <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-main border-[4px] border-solid border-white shadow-sm z-10" />
                                                
                                                <div className="flex flex-col gap-[0.6rem]">
                                                    <span className="text-[1.4rem] font-bold text-main">전개</span>
                                                    <p className="text-[1.6rem] text-[#333] leading-relaxed">
                                                        {item.content.development.split("'")[0]}
                                                    </p>
                                                    {item.content.development.includes("'") && (
                                                        <div className="bg-[#fcf8f2] p-[1.2rem_1.6rem] rounded-[0.8rem] text-[1.5rem] font-medium text-[#495057] italic before:content-['“'] after:content-['”'] before:text-main/40 before:mr-[0.4rem] after:text-main/40 after:ml-[0.4rem]">
                                                            {item.content.development.match(/'([^']+)'/)?.[1]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {item.content.conclusion && (
                                            <div className="relative pl-[3.6rem]">
                                                <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-gray-400 border-[4px] border-solid border-white shadow-sm z-10" />
                                                
                                                <div className="flex flex-col gap-[0.6rem]">
                                                    <span className="text-[1.4rem] font-bold text-gray-500">마무리</span>
                                                    <p className="text-[1.6rem] text-[#333] leading-relaxed">
                                                        {item.content.conclusion.split("'")[0]}
                                                    </p>
                                                    {item.content.conclusion.includes("'") && (
                                                        <div className="bg-[#f8f9fa] p-[1.2rem_1.6rem] rounded-[0.8rem] text-[1.5rem] font-medium text-[#495057] italic before:content-['“'] after:content-['”'] before:text-gray-400/40 before:mr-[0.4rem] after:text-gray-400/40 after:ml-[0.4rem]">
                                                            {item.content.conclusion.match(/'([^']+)'/)?.[1]}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>

                                <div className="flex gap-[1.6rem] my-[1.6rem]">
                                    <div className="flex-1 border-solid border-[.2rem] bg-[#ddeaf9] border-[#86bcff] p-[2rem] rounded-[1.2rem]">
                                        <p className="text-[1.8rem] font-bold text-[#1e40af] mb-[1.2rem]"><span className="text-[2rem]">🎒</span> 준비물</p>

                                        <ul className="flex flex-wrap gap-[0.8rem]">
                                            {item.materials.map((data, idx) => (
                                                <li 
                                                    className="text-[1.4rem] font-semibold rounded-[60rem] bg-bgCard p-[0.6rem_1.4rem] border-[#86bcff] border-solid border text-[#2563eb] shadow-sm" 
                                                    key={idx}
                                                >
                                                    {data}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {item.precautions && item.precautions.length > 0 && (
                                        <div className="flex-1 border-solid border-[.2rem] bg-[#fff5f5] border-[#feb2b2] p-[2rem] rounded-[1.2rem]">
                                            <p className="text-[1.8rem] font-bold text-[#9b2c2c] mb-[1rem] flex items-center gap-[0.6rem]">
                                                <span className="text-[2rem]">⚠️</span> 유의 사항
                                            </p>
                                            <ul className="space-y-1.5 pl-[0.4rem]">
                                                {item.precautions.map((pre, idx) => (
                                                    <li 
                                                        className="text-[1.5rem] text-[#4a5568] font-medium leading-relaxed before:content-['•'] before:text-[#e53e3e] before:mr-[0.8rem]" 
                                                        key={idx}
                                                    >
                                                        {pre}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {item.extensionActivity && (
                                        <div className="flex-1 border-solid border-[.2rem] bg-[#f3f0ff] border-[#d6bbfb] p-[2rem] rounded-[1.2rem]">
                                            <p className="text-[1.8rem] font-bold text-[#5b21b6] mb-[1rem] flex items-center gap-[0.6rem]">
                                                <span className="text-[2rem]">✨</span> 확장 활동
                                            </p>
                                            <div className="pl-[0.4rem] text-[1.5rem] text-[#4a5568] font-medium leading-relaxed">
                                                {item.extensionActivity}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default page