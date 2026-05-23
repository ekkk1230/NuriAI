"use client";

import { useParams } from 'next/navigation';
import { usePlanStore } from "../../store/usePlanStore";
import { IoArrowBackOutline } from "react-icons/io5";
import { DOMAIN_STYLES } from '@/app/constance/activityOptions';
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
                                style={{ '--domain-line-color': `var(--color-cate${item.domain === "기본생활" || item.domain === "기본생활·신체" ? 0 : item.domain === "신체운동" || item.domain === "신체운동·건강" ? 1 : item.domain === "의사소통" ? 2 : item.domain === "사회관계" ? 3 : item.domain === "예술경험" ? 4 : 5})` } as React.CSSProperties}
                                className="relative bg-bgCard rounded-[1.2rem] mb-[2rem] shadow-sm p-[3rem_3rem_3rem_4.5rem] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[.8rem] before:h-[100%] before:rounded-[1.2rem_0_0_1.2rem] before:rounded-l-[1.2rem] before:bg-[var(--domain-line-color)]"
                            >
                                <div className="flex gap-[1rem] items-center mb-[1rem]">
                                    <p className={`${domainStyle} text-[1.2rem] inline-block p-[.8rem_1.2rem] font-semibold rounded-[60rem]`}>
                                        {item.domain}
                                    </p>

                                    <span className="text-textMuted text-[1.2rem] font-semibold">활동 {idx + 1} / {plan.plans.length}</span>
                                </div>

                                <p className="text-[2.4rem] mb-[1rem] font-bold">{item.activityName}</p>

                                <div className="mb-[2rem]">
                                    <p className="text-[2rem] font-semibold mb-[1rem]">활동 목표</p>

                                    <ul className="space-y-1 pl-[1rem]">
                                        {item.objectives.map((obj, idx) => (
                                            <li className="before:content-['•'] before:text-main before:mr-[.8rem] text-[1.6rem]" key={idx}>{obj}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-solid border-[.2rem] bg-[#ddeaf9] border-[#86bcff] my-[1rem] p-[1.6rem] rounded-[1.2rem]">
                                    <p className="text-[1.8rem] font-semibold mb-[1rem]">준비물</p>
                                    <ul className="flex gap-[1rem]">
                                        {item.materials.map((data, idx) => (
                                            <li className="text-[1.4rem] rounded-[60rem] bg-bgCard p-[.8rem_1rem] border-[#86bcff] border-solid border" key={idx}>{data}</li>
                                        ))}
                                    </ul>
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