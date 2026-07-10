'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AGE_OPTIONS, DOMAIN_STYLES, DOMAIN_TYPES } from "@/constants/activityOptions"; 
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { usePlanStore } from "@/store/usePlanStore";
import NoPlan from "@/components/Planner/NoPlan";
import { FaUserLarge, FaHeart, FaEye } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { useForm } from "@/hook/useForm";
import LoadingFetchPlans from "@/components/Loading/LoadingFetchPlans";
import { Paging } from "@/components/Paging/Paging";


function page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageFromUrl = Number(searchParams.get("page")) || 0;

    const { planStorage, searchPlans, isFetchPlanLoading, currentPage, totalPages, totalCounts } = usePlanStore();

    const { form: searchForm, handleChange } = useForm({
        searchTxt: searchParams.get("txt") || "",
        searchAge: searchParams.get("age") || "",
        searchArea: searchParams.get("area") || "",
        sortType: "latest"
    });

    const handlePageChange = (page: number) => {
        router.push(`?page=${page}&txt=${searchForm.searchTxt}&age=${searchForm.searchAge}&area=${searchForm.searchArea}`);
        usePlanStore.getState().fetchPage(page);
    };

    // console.log(planStorage)

   // 1. 처음 마운트 될 때 실행 (데이터가 없거나 처음 진입 시)
    useEffect(() => {
        if (planStorage.length > 0) return;

        // 데이터가 없다면 URL의 페이지 정보로 첫 로딩
        usePlanStore.getState().searchPlans(
            searchForm.searchTxt, 
            searchForm.searchAge, 
            searchForm.searchArea, 
            pageFromUrl 
        );
    }, []); 

    const [isMounted, setIsMounted] = useState(false);
    // 2. 검색 조건 변경 시 실행 (검색어를 칠 때)
    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }
    
        const timer = setTimeout(() => {
            // 검색어 변경 시 0페이지로 이동
            router.push(`?page=0&txt=${searchForm.searchTxt}&age=${searchForm.searchAge}&area=${searchForm.searchArea}`);
            usePlanStore.getState().searchPlans(
                searchForm.searchTxt, 
                searchForm.searchAge, 
                searchForm.searchArea, 
                0
            );
        }, 500);
        return () => clearTimeout(timer);
    }, [searchForm.searchTxt, searchForm.searchAge, searchForm.searchArea]);
 
    const [sortType, setSortType] = useState<string>("rank");

    const getSortBtnClass = (value: string) => {
        const base = "p-[1rem_1.6rem] text-[1.4rem] rounded-[.8rem] transition-all";
        const active = sortType === value ? "bg-white shadow-sm font-bold text-main" : "text-gray-500";
        return `${base} ${active}`;
    };

    const handleNavigate = (id: number) => {
        router.push(`/storage/${id}`);
    }

    return (
        <div className="bg-bgCard flex flex-col h-[100%] overflow-y-hidden">
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">계획안 둘러보기</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">다른 선생님들이 만든 교육 계획안을 참고하여 활용해보세요.</p>
            </div>

            <div className="h-full overflow-y-hidden border-b-[.1rem] border-solid border-[#eee] p-[1.8rem_2.6rem] bg-bgPreview">
                <div className="mt-[2rem] shadow-sm p-[2rem] rounded-[.8rem] bg-bgCard">
                    <div className="flex gap-[.4rem]">
                        <input type="text" name="searchTxt" value={searchForm.searchTxt} onChange={handleChange} placeholder="제목이나 내용으로 계획안을 검색할 수 있습니다." />
                    </div>

                    <div className="flex w-full mt-[1.2rem] items-center">
                        <label className="flex items-center mr-[1.2rem]">
                            <span className="text-[1.6rem] whitespace-nowrap font-semibold mr-[.8rem]">연령</span>
                            <select name="searchAge" id="searchAge" value={searchForm.searchAge} onChange={handleChange} className="text-[1.4rem] !w-[15rem]">
                                <option value="전체">전체</option>
                                {AGE_OPTIONS.map(item => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </label>

                        <label className="flex items-center mx-[1.2rem]">
                            <span className="text-[1.6rem] whitespace-nowrap font-semibold mr-[.8rem]">영역</span>
                            <select name="searchArea" id="searchArea" value={searchForm.searchArea} onChange={handleChange} className="text-[1.4rem] !w-[15rem]">
                                <option value="전체">전체</option>
                                {DOMAIN_TYPES.map((item, idx) => (
                                    <option key={idx} value={item}>{item}</option>
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
                </div>

                {isFetchPlanLoading ? (
                    <LoadingFetchPlans type="plans" />
                ) : planStorage.length >= 1 ? (
                    <>
                        <p className="text-textMuted text-[1.4rem] font-semibold my-[3rem_1rem]">총 <span className="text-main font-bold">{totalCounts}개</span>의 계획안</p>
                        <div className="grid grid-cols-4 gap-[1.6rem]">
                            {planStorage.map((plan, idx) => (
                                <div onClick={() => handleNavigate(plan.id)} key={`${plan.id}-${idx}`} className="cursor-pointer relative bg-bgCard rounded-[.8rem] shadow-sm before:content-[''] before:absolute before:left-0 before:top-0 before:rounded-[.8rem_.8rem_0_0] p-[1.6rem] before:bg-main-gradient before:w-full before:h-[.4rem]">
                                    <p className="text-[2rem] font-bold mb-[1rem]">{plan.mainTheme}</p>
                                    <ul className="flex gap-[.4rem] items-center text-[1.4rem] text-textMuted mb-[1rem]">
                                        <li className="after:content-['|'] flex gap-[.4rem] items-center text-[1.4rem] text-textMuted"><FaUserLarge />{plan.author} 선생님</li>
                                        <li className="text-[1.4rem] ">{plan.age}</li>
                                    </ul>

                                    <div>
                                        <div className="flex gap-[.4rem] mb-[.8rem] items-center">
                                            <p className="text-[1.4rem]">{plan.plans.length}개 활동 - </p>
                                            {/* 활동 영역 */}
                                            <ul className="flex gap-[.4rem]">
                                                {plan.plans.slice(0,3).map((item, idx) => {
                                                    const domain = item.domain.split(" ")[0];
                                                    const domainStyle = DOMAIN_STYLES[domain as keyof typeof DOMAIN_STYLES];
                                                    // console.log(DOMAIN_STYLES[domain])

                                                    return (
                                                        <li 
                                                            key={idx} 
                                                            className={`text-[1.2rem] px-[.8rem] py-[.4rem] rounded-[60rem] ${domainStyle}`}
                                                        >
                                                            {item.domain}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>

                                        {/* 활동 목표 */}
                                        <div className="text-[1.4rem] mt-[1rem] line-clamp-2">{plan.activeIntro}</div>

                                        <div className="flex gap-[1.2rem] mt-[.8rem]">
                                            <p className="text-[1.4rem] flex items-center gap-[.4rem] text-textMuted"><FaHeart className="text-red-500" />{plan.likeCount}</p>
                                            <p className="text-[1.4rem] flex items-center gap-[.4rem] text-textMuted"><FaEye />{plan.viewCount}</p>
                                            <p className="text-[1.4rem] text-textMuted flex gap-[.4rem] text-textMuted items-center ml-auto"><MdOutlineAccessTime />{plan.createdAt.split('T')[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <Paging currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <NoPlan txt="현재 준비되어 있는 계획안이 없습니다." showButton={true} router={router} />
                )}
            </div>
            
        </div>
    )
}

export default page