"use client";

import { usePlanStore } from "@/store/usePlanStore";
import { useEffect } from "react";
import { TbPencil, TbTargetArrow } from "react-icons/tb";

function SamplePlan() {
    const { planStorage, fetchAllPlans } = usePlanStore();

    useEffect(() => {
        fetchAllPlans(0, "", "전체", "전체")
    }, [fetchAllPlans]);

    const randomIndex = planStorage.length > 0 
        ? Math.floor(Math.random() * planStorage.length) 
        : null;

    const randomPlan = randomIndex !== null ? planStorage[randomIndex] : null;

    if (!randomPlan) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[38rem]">
                <div className="w-[5rem] h-[5rem] border-[.6rem] border-[#eee] border-t-[#ad46ff] rounded-full animate-spin"></div>
            
            </div>
        )
    }
    
    return (
         <div className="rounded-[2.4rem] bg-bgPreview padding-12 p-[3.2rem]">
            {planStorage.length >= 1 ? (
                <div className="relative bg-bgCard rounded-[1.2rem] p-[4rem_3.2rem]">
                    <p className="text-[2.4rem] font-bold mb-[2.4rem]">{randomPlan.mainTheme} - {randomPlan.age}</p>
                    <ul className="space-y-[2.4rem] pl-[1rem]">
                        <li>
                            <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><TbTargetArrow /> 활동 목표</p>
                            <ul className="space-y-[1rem] pl-[2rem]">
                                {randomPlan.plans[0].objectives.map((obj, idx) => (
                                    <li key={idx} className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">{obj}</li>
                                ))}
                            </ul>
                        </li>
                        <li>
                            <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><TbPencil /> 활동 내용</p>
                            <ul className="space-y-[1rem] pl-[2rem]">
                            {Object.entries(randomPlan?.plans?.[0]?.introduction ?? {})
                                .slice(0, 1)
                                .map(([key, cont], idx) => (
                                    <li key={idx} className="text-[1.6rem] before:content-['·'] before:mr-2 flex items-center gap-[.4rem]">
                                        {cont}
                                    </li>
                                ))
                            }
                            </ul>
                        </li>
                    </ul>
                    <p className="text-[1.8rem] font-semibold text-textMuted mt-[2.4rem]">
                        더 많은 내용은 워크스페이스에서 확인하세요...
                    </p>
                </div>
            ) : (
                <div className="relative bg-bgCard rounded-[1.2rem] p-[4rem_3.2rem]">
                    <p className="text-[2.4rem] font-bold mb-[2.4rem]">나비의 한살이 - 만4세</p>
                    <ul className="space-y-[2.4rem] pl-[1rem]">
                        <li>
                            <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><TbTargetArrow /> 활동 목표</p>
                            <ul className="space-y-[1rem] pl-[2rem]">
                               <li className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">나비의 성장 과정을 관찰하며 생명의 신비로움을 느낀다.</li>
                            </ul>
                        </li>
                        <li>
                            <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><TbPencil /> 활동 내용</p>
                            <ul className="space-y-[1rem] pl-[2rem]">
                                <li className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">
                                    나비의 성장 과정을 관찰하며 생명의 신비로움을 느끼는 활동입니다. 애벌레부터 나비까지의 변화 과정을 직접 관찰하고 기록합니다.
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p className="text-[1.8rem] font-semibold text-textMuted mt-[2.4rem]">
                        더 많은 내용은 워크스페이스에서 확인하세요...
                    </p>
                </div>
            )}
        </div>
    )
}

export default SamplePlan