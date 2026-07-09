'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlanStore } from "@/store/usePlanStore"; 
import { AGE_OPTIONS } from "@/constants/activityOptions"; 
import PlanItem from "@/components/Planner/PlanItem";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import LoadingFetchPlans from "../Loading/LoadingFetchPlans";
import { Paging } from "../Paging/Paging";

const SORT_OPTIONS = [
    { value: "latest", label: "최신 순" },
    { value: "oldest", label: "오래된 순" },
];

function Page() {
    const searchParams = useSearchParams();
    const authorFilter = searchParams.get("author") || "";

    const router = useRouter();
    const { fetchUserPlans, fetchUserCollectItem, userPlans, userCollectPlans, deletePlans, isFetchPlanLoading } = usePlanStore();
    const { user } = useWelcomeStore();

    const handlePageChange = (page: number) => {
        usePlanStore.getState().fetchPage(page);
    }
    
    const [searchTit, setSearchTit]  = useState<string>("");
    const [searchAge, setSearchAge] = useState<string>("");
    const [sortType, setSortType] = useState<string>("latest");
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const [isSavedFilter, setIsSavedFilter] = useState(true);
    const [currentPage, setCurrentPage] = useState(0); 
    const ITEMS_PER_PAGE = 12;

    useEffect(() => {
        if (!user) return;
        fetchUserPlans(user);
        fetchUserCollectItem(Number(user.id));
    }, [user]);

    const combinedPlans = [...(userPlans || []), ...(userCollectPlans || [])];
    
    const uniquePlans = Array.from(new Map(combinedPlans.map(item => [item.id, item])).values());

    const filteredPlans = uniquePlans.filter(plan => {
        if (!plan) return false;
        
        const matchesTitle = searchTit ? plan.mainTheme.includes(searchTit) : true;
        const matchesAge = (!searchAge || searchAge === "전체") ? true : plan.age === `만 ${searchAge}세`;

        if (!matchesTitle || !matchesAge) return false;

        // "내가 작성한 계획안만 보기" 버튼을 눌렀을 때
        if (!isSavedFilter) {
            return plan.author === user?.userNickname;
        }

        // 전체 보기일 때는 합쳐진 모든 데이터 통과
        return true;
    });

    const displayedPlans = filteredPlans.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortType === "latest" ? dateB - dateA : dateA - dateB;
    });

    const handleCheckToggle = (id: number) => {
        setCheckedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id] );
    };

    const paginatedPlans = displayedPlans.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
    const totalLocalPages = Math.ceil(displayedPlans.length / ITEMS_PER_PAGE);

    const handleLocalPageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleRemove = async () => {
        try {
            await deletePlans(checkedIds); 
            alert("삭제되었습니다.");
            setCheckedIds([]);
            if (user) {
                fetchUserPlans(user);
                fetchUserCollectItem(Number(user.id));
            }
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    const baseAgeSelectBtnClass = "rounded-[60rem] p-[.8rem_1.8rem] text-[1.4rem] font-semibold text-textLight";
    const ActiveSelectBtnClass = (value: string, type: string) => {
        const isActive = type === "age" ? searchAge === value : sortType === value;
        const ageBtnClass = isActive ? "bg-main" : "bg-disabled hover:bg-hoverDisabled";
        const sortBtnClass = isActive ? "bg-blueActive" : "bg-disabled hover:bg-hoverDisabled";
        return `${baseAgeSelectBtnClass} ${type === "age" ? ageBtnClass : sortBtnClass}`;
    };

    const ArrToBtn = (arr: any[], type: string) => {
        const setType = type === "age" ? setSearchAge : setSortType;
        const finalArr = type === "age" ? [{ value: "", label: "전체" }, ...arr] : arr;
        return finalArr.map(item => (
            <li key={item.value}> 
                <button type="button" className={ActiveSelectBtnClass(String(item.value), type)} onClick={() => setType(String(item.value))}>
                    {item.label}
                </button>
            </li>
        ));
    };

    return (
        <div className="bg-bgCard flex flex-col h-[100%] overflow-y-hidden">
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">보관함</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">생성된 교육 계획안을 관리할 수 있습니다.</p>
            </div>

            <div className="border-b-[.1rem] border-solid border-[#eee] p-[1.8rem_2.6rem]">
                <div className="flex gap-[.4rem]">
                    <input type="text" value={searchTit} onChange={e => setSearchTit(e.target.value)} placeholder="주제로 계획안을 검색할 수 있습니다." />
                    {!authorFilter && checkedIds.length >= 1 && (
                        <button onClick={handleRemove} className="rounded-[.8rem] w-[15rem] text-center p-[1rem_1.6rem] bg-red-600 text-textLight hover:bg-red-700 whitespace-nowrap text-[1.4rem]">선택 삭제 ({checkedIds.length}개)</button>
                    )}
                </div>

                <div className="flex justify-between items-center mt-[1.2rem]">
                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(AGE_OPTIONS, "age") }
                        <button onClick={() => setIsSavedFilter(!isSavedFilter)} className={`ml-[1rem] text-white p-[0.6rem_1.2rem] rounded-[0.8rem] text-[1.4rem] font-bold border transition ${isSavedFilter ? "bg-main" : "bg-mainLight"}`}>
                            {isSavedFilter ? "전체 보기" : "내가 작성한 계획안만 보기"}
                        </button>
                    </ul>
                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(SORT_OPTIONS, "type") }
                    </ul>
                </div>
            </div>

            <div className="bg-bgPreview w-[100%] h-[100%] p-[2.6rem] flex-1 overflow-y-auto">
                {isFetchPlanLoading ? (
                    <LoadingFetchPlans type="storage" />
                ) : displayedPlans.length >= 1 ? (
                    <>
                        <p className="text-textMuted text-[1.4rem] font-semibold mb-[1.2rem]">총 <span className="text-main font-bold">{displayedPlans.length}개</span>의 계획안</p>
                        <div className="grid gap-[1.8rem_1.6rem] grid-cols-4">
                            {displayedPlans.map((plan, idx) => (
                                <PlanItem 
                                    plan={plan} 
                                    key={`${plan.id}-${idx}`} 
                                    checkHandle={handleCheckToggle} 
                                    onClick={() => router.push(`/storage/${plan.id}`)} 
                                    authorFilter={authorFilter}
                                />
                            ))}
                        </div>
                        
                        {totalLocalPages > 1 && (
                            <Paging currentPage={currentPage} totalPages={totalLocalPages} onPageChange={handlePageChange} />
                        )}
                    </>
                ) : (
                    <div className="mt-[10rem] text-center flex flex-col gap-[0.6rem] mb-[2.4rem]">
                        <p className="text-[1.8rem] font-bold text-[#212529]">조건에 맞는 계획안이 없습니다</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page;