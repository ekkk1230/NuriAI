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
            <div className="bg-bgCard flex flex-col h-[100%]">
                <div className="p-[1.6rem_0] border-b-[.1rem] border-solid border-[#eee]">
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

                <div className="w-[70%] mx-auto mt-[2rem]">
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

                    <div className="bg-bgCard rounded-[1.2rem] mb-[2rem]">
                        <p>활동 개요</p>
                        <div>이 계획안은 "{plan?.mainTheme}" 주제로 {plan?.plans.length}개 교육과정 영역을 통합한 {plan?.age} {ageGroup} 대상 교육 계획안입니다.</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default page