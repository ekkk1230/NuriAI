import { usePlanStore } from "@/store/usePlanStore";
import React from "react";
import { MdEdit, MdSave, MdSaveAlt, MdMenuBook, MdReportProblem } from "react-icons/md"
import { TbTargetArrow } from "react-icons/tb";

function PlanPreview() {
    const { currentCreatePlan } = usePlanStore();
    console.log(currentCreatePlan)

    const mainTheme = currentCreatePlan[0].mainTheme;
    const age = currentCreatePlan[0].age;
    const planCount = currentCreatePlan[0].plans.length;
    const plansArr = currentCreatePlan[0].plans;

    return (
        <>
            <div className="border-b-[0.1rem] border-solid border-[#eee] bg-bgCard p-[2rem] flex justify-between">
                <div>
                    <p className="text-[1.6rem] font-bold">{currentCreatePlan[0].mainTheme}</p>
                    <ul className="flex gap-[.4rem] mt-[.4rem] text-[1.4rem] text-textMuted">
                        <li className="flex after:content-['•'] after:ml-[.4rem]">{currentCreatePlan[0].age}</li>
                        <li className="flex after:content-['•'] after:ml-[.4rem]">소집단</li>
                        <li className="flex ">{currentCreatePlan[0].plans.length}개 영역</li>
                    </ul>
                </div>
                <div className="flex gap-[.4rem]">
                    <button className="flex gap-[.4rem] rounded-[1.2rem] text-textLight cursor-pointer font-semibold p-[1rem_2rem] items-center text-[1.4rem] bg-[#8744f3]"><MdSave className="text-[2rem]" /> 보관함에 저장</button>
                    <button className="flex gap-[.4rem] rounded-[1.2rem] text-textLight cursor-pointer font-semibold p-[1rem_2rem] items-center text-[1.4rem] bg-blueActive"><MdSaveAlt className="text-[2rem]" /> PDF 내보내기</button>
                </div>
            </div>

            <div className="w-[95%] mx-auto">
                <div className="bg-sub2-gradient mt-[2rem] rounded-2xl p-[2rem] text-textLight">
                    <p className="text-[2rem] font-bold  mb-[2rem]">활동 요약</p>
                    <div className="text-[1.6rem]">
                        <strong>{currentCreatePlan[0].mainTheme} 주제</strong>로 소집단 {currentCreatePlan[0].plans.length}개 영역의 통합 활동이 생성되었습니다. <strong>{currentCreatePlan[0].age}</strong> 대상 활동입니다.
                        <p className="text-[1.4rem] mt-[1rem]">{currentCreatePlan[0].activeIntro}</p>
                    </div>
                </div>

                <div className="relative bg-bgCard rounded-[1.2rem] p-[4rem_3.2rem] mt-[2rem] before:content-[''] before:w-[.8rem] before:h-[100%] before:bg-cate1 before:absolute before:left-0 before:top-0 before:rounded-[1.2rem_0_0_1.2rem]">
                    {plansArr.map((p, idx) => (
                        <div key={idx} className="mb-[4rem] pb-[4rem] border-b-[.1rem] border-solid border-[#eee] last:border-b-0 last:p-[4rem_0]">
                            <div className="flex gap-[1rem] items-center">
                                <span className="bg-cate1 text-cate1-text rounded-[60rem] p-[1rem_1.2rem] text-[1.6rem] font-semibold">{p.domain}</span>
                                <div className="flex text-textMuted text-[1.4rem]">
                                    <span className="font-semibold text-[#000]">{idx + 1}</span> / {planCount}
                                </div>

                                <button className="p-[1.2rem_2rem] text-[1.6rem] font-semibold text-[#06599d] bg-[#c8e0fd] hover:bg-[#a6caf7] transition-bg duration-300 flex gap-[.4rem] rounded-[1.2rem] ml-auto items-center cursor-pointer"><MdEdit className="text-[1.8rem]"/>수정하기</button>
                            </div>

                            <p className="text-[2.4rem] font-bold my-[2.2rem]">{p.activityName}-{p.domain}</p>

                            <ul className="space-y-[2.4rem] pl-[1rem]">
                                <li>
                                    <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><TbTargetArrow /> 활동 목표</p>
                                    <ul className="space-y-[1rem] pl-[2rem]">
                                        {p.objectives.map((obj, idx) => (
                                            <li key={idx} className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">{obj}</li>
                                        ))}
                                    </ul>
                                </li>
                                <li>
                                    <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><MdMenuBook /> 활동 방법</p>
                                    <ul className="space-y-[1rem] pl-[2rem]">
                                        {[
                                            { key: 'introduction', label: '도입', data: p.introduction },
                                            { key: 'development', label: '전개', data: p.development },
                                            { key: 'conclusion', label: '마무리', data: p.conclusion }
                                        ].map((stage) => (
                                            <li key={stage.key} className="flex gap-[.4rem] text-[1.6rem] mb-[1rem]">
                                                <div className="font-bold text-main shrink-0">
                                                    {stage.label} :
                                                </div>
                                                <div className="flex flex-col gap-[0.8rem]">
                                                    <p className="text-[#333] leading-relaxed">
                                                        <span className="font-semibold">[활동 내용]</span> {stage.data.description}
                                                    </p>
                                                    <p className="text-[#555] leading-relaxed italic bg-gray-50 p-2 rounded">
                                                        <span className="font-semibold">[교사 발문]</span> "{stage.data.teacherTalk}"
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                        {/* <li className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">도입: asf 주제를 소개하고 유아들의 흥미를 유발합니다</li>
                                        <li className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">전개: 신체운동 영역의 핵심 활동을 진행하며 유아들이 적극적으로 참여하도록 합니다</li>
                                        <li className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">마무리: 활동을 정리하고 경험을 나누며 마무리합니다</li> */}
                                    </ul>
                                </li>
                                <li>
                                    <p className="text-[2rem] font-bold mb-[1.2rem] flex gap-[.4rem] items-center"><MdReportProblem /> 유의점</p>
                                    <ul className="space-y-[1rem] pl-[2rem]">
                                        {Object.entries(p.precautions).map((item, idx) => {
                                            console.log(item)
                                            return (
                                                <li key={idx} className="flex gap-[.4rem] before:content-['•'] before:block text-[1.6rem]">{item[1]}</li>
                                            )
                                        })}
                                    </ul>
                                </li>
                            </ul>      
                        </div>
                    ))}
                                                      
                </div>
            </div>
        </>
    )
}

export default PlanPreview