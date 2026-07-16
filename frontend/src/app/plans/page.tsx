'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { AGE_OPTIONS, DOMAIN_TYPES } from "@/constants/activityOptions"; 
import { usePlanStore } from "@/store/usePlanStore";
import NoPlan from "@/components/Planner/NoPlan";
import { useForm } from "@/hook/useForm";
import LoadingFetchPlans from "@/components/Loading/LoadingFetchPlans";
import { Paging } from "@/components/Paging/Paging";
import PlanBox from "@/components/Planner/PlanBox";


function page() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pageFromUrl = Number(searchParams.get("page")) || 0;
    const sortFromUrl = searchParams.get("sort") || "createdAt";

    const { planStorage, searchPlans, isFetchPlanLoading, currentPage, totalPages, totalCounts, fetchPage } = usePlanStore();

    const { form: searchForm, handleChange } = useForm({
        searchTxt: searchParams.get("txt") || "",
        searchAge: searchParams.get("age") || "",
        searchArea: searchParams.get("area") || "",
        sortType: "createdAt"
    });

    const [sortType, setSortType] = useState<string>(sortFromUrl);
    const [isMounted, setIsMounted] = useState(false);

   // 1. 초기 진입 처리 (상세 페이지에서 돌아온 경우 페이지 유지, 아니면 0페이지)
    useEffect(() => {
        const prevPath = sessionStorage.getItem("prevPath");
        const initialPage = prevPath === "detail" ? pageFromUrl : 0;

        searchPlans(
            searchForm.searchTxt, 
            searchForm.searchAge, 
            searchForm.searchArea, 
            initialPage,
            sortType
        );

        return () => sessionStorage.removeItem("prevPath");
    }, []); 

    // 2. 검색 조건 변경 시 (검색/필터 변경)
    useEffect(() => {
        if (!isMounted) {
            setIsMounted(true);
            return;
        }
    
        const timer = setTimeout(() => {
            const sortQuery = `${sortType},desc`;
            router.push(`?page=0&txt=${searchForm.searchTxt}&age=${searchForm.searchAge}&area=${searchForm.searchArea}&sort=${sortType}`);
            searchPlans(searchForm.searchTxt, searchForm.searchAge, searchForm.searchArea, 0, sortQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchForm.searchTxt, searchForm.searchAge, searchForm.searchArea, sortType]);

    // 3. 정렬 조건 변경 시
    const handleSortChange = (type: string) => {
        const sortQuery = `${type},desc`;
        setSortType(type);
        router.push(`?page=0&txt=${searchForm.searchTxt}&age=${searchForm.searchAge}&area=${searchForm.searchArea}&sort=${type}`);
        searchPlans(searchForm.searchTxt, searchForm.searchAge, searchForm.searchArea, 0, sortQuery);
    };

    const handlePageChange = (page: number) => {
        router.push(`?page=${page}&txt=${searchForm.searchTxt}&age=${searchForm.searchAge}&area=${searchForm.searchArea}&sort=${sortType}`);
        fetchPage(page);
    };

    const getSortBtnClass = (value: string) => {
        const base = "p-[1rem_1.6rem] text-[1.4rem] rounded-[.8rem] transition-all";
        const active = sortType === value ? "bg-white shadow-sm font-bold text-main" : "text-gray-500";
        return `${base} ${active}`;
    };

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
                            <ul className="flex p-[.2rem] rounded-[.8rem] bg-[#efefef] gap-[.4rem]">
                                {[
                                    { id: "createdAt", label: "최신순" },
                                    { id: "likeCount", label: "인기순" },
                                    { id: "viewCount", label: "조회순" }
                                ].map((item) => (
                                    <li key={item.id}>
                                        <button 
                                            type="button" 
                                            onClick={() => handleSortChange(item.id)}
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
                                <PlanBox plan={plan} idx={idx} key={idx} />
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