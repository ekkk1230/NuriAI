'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { AGE_OPTIONS, AREA_TYPES } from "@/constants/activityOptions"; 
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { usePlanStore } from "@/store/usePlanStore";
import NoPlan from "@/components/Planner/NoPlan";


function page() {
    const router = useRouter();
    const { user } = useWelcomeStore();
    const { planStorage, fetchAllPlans } = usePlanStore();

    useEffect(() => {
        fetchAllPlans()
    }, [fetchAllPlans]);

    console.log(planStorage)

    const [searchTit, setSearchTit]  = useState<string>("");    
    const [sortType, setSortType] = useState<string>("rank");

    const getSortBtnClass = (value: string) => {
        const base = "p-[1rem_1.6rem] text-[1.4rem] rounded-[.8rem] transition-all";
        const active = sortType === value ? "bg-white shadow-sm font-bold text-main" : "text-gray-500";
        return `${base} ${active}`;
    };

    return (
        <div className="bg-bgCard flex flex-col h-[100%]">
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">계획안 둘러보기</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">다른 선생님들이 만든 교육 계획안을 참고하여 활용해보세요.</p>
            </div>

            <div className="border-b-[.1rem] border-solid border-[#eee] p-[1.8rem_2.6rem] bg-bgPreview">
                <div className="flex gap-[.4rem]">
                    <input type="text" value={searchTit} onChange={e => setSearchTit(e.target.value)} placeholder="제목이나 내용으로 계획안을 검색할 수 있습니다." />
                </div>

                <div className="flex w-full mt-[1.2rem] items-center">
                    <label className="flex items-center">
                        <span className="text-[1.6rem] whitespace-nowrap font-semibold mr-[.8rem]">연령</span>
                        <select name="" id="" className="text-[1.4rem]">
                            <option value="">전체</option>
                            {AGE_OPTIONS.map(item => (
                                <option key={item.value} value={item.value}>{item.label}</option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center mx-[1.2rem]">
                        <span className="text-[1.6rem] whitespace-nowrap font-semibold mr-[.8rem]">영역</span>
                        <select name="" id="" className="text-[1.4rem]">
                            <option value="">전체</option>
                            {AREA_TYPES.map((item, idx) => (
                                <option key={idx} value={idx}>{item}</option>
                            ))}
                        </select>
                    </label>

                    <div className="flex items-center ml-auto">
                        <span className="text-[1.6rem] whitespace-nowrap font-semibold mr-[.8rem]">정렬</span>
                        <ul className="flex p-[.4rem] rounded-[.8rem] bg-[#efefef] gap-[.4rem]">
                        <ul className="flex p-[.4rem] rounded-[.8rem] bg-[#efefef] gap-[.4rem]">
                            {[
                                { id: "rank", label: "인기순" },
                                { id: "date", label: "최신순" },
                                { id: "view", label: "조회순" }
                            ].map((item) => (
                                <li key={item.id}>
                                    <button 
                                        type="button" 
                                        onClick={() => setSortType(item.id)}
                                        className={getSortBtnClass(item.id)}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        </ul>
                    </div>
                </div>

                {planStorage.length >= 1 
                    ? (
                        planStorage.map(plan => (
                            <div key={plan.id} className="border-solid border-[#000] border-[.1rem]">
                                <p>{plan.mainTheme}</p>
                                <p>{plan.author} 선생님</p>
                                <div>
                                    <p>{plan.age}</p>
                                    <p>{plan.plans.length}개 활동</p>

                                    {/* 활동 영역 */}
                                    <ul className="flex flex-col">
                                        {plan.plans.map((item, idx) => (
                                        <li>
                                            {item.activityType}
                                        </li>
                                        ))}
                                    </ul>

                                    {/* 활동 목표 */}
                                    <ul>
                                    {plan.plans.map((item, idx) => (
                                        item.objectives && item.objectives.length > 0 && (
                                            <li key={`object-${idx}`}>
                                                {item.objectives[0]}
                                            </li>
                                        )
                                    ))}
                                    </ul>

                                    {plan.viewCount} | {plan.likeCount}

                                    <p>{plan.createdAt}</p>


                                </div>
                            </div>
                        ))

                        /**
                         *  나비의 한살이
                            ㄴㄹㅁㄴ 선생님
                            만 4세 자연탐구
                            나비의 성장 과정을 관찰하며 생명의 신비로움을 느끼는 활동입니다. 애벌레부터 나비까지의 변화 과정을 직접 관찰하고 기록합니다.

                            421 3120    5월 12일
                            좋아요 보관
                         */
                    ) 
                    : (
                        <NoPlan />
                    )
                }
            </div>

            
        </div>
    )
}

export default page