'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { usePlanStore } from "@/store/usePlanStore"; 
import { AGE_OPTIONS } from "@/constants/activityOptions"; 
import PlanItem from "@/components/Planner/PlanItem";
import { useWelcomeStore } from "@/store/useWelcomeStore";

const SORT_OPTIONS = [
    { value: "latest", label: "최신 순" },
    { value: "oldest", label: "오래된 순" },
];

function page() {
    const searchParams = useSearchParams();
    const authorFilter = searchParams.get("author") || "";

    const router = useRouter();
    const { fetchAllPlans, isLoaded, getFilteredPlans,
        fetchUserPlans, fetchUserCollectItem, userPlans, userCollectPlans, deletePlans } = usePlanStore();
    const { user } = useWelcomeStore();
    
    const [searchTit, setSearchTit]  = useState<string>("");
    const [searchAge, setSearchAge] = useState<string>("");
    const [sortType, setSortType] = useState<string>("latest");
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const [isSavedFilter, setIsSavedFilter] = useState(true);
    

    useEffect(() => {
        fetchAllPlans();
    }, [fetchAllPlans]);

    useEffect(() => {
        if (!user) return;
        fetchUserPlans(user);
        fetchUserCollectItem(Number(user.id));
    }, [user]);

    if (!isLoaded) return <div className="p-10">로딩 중...</div>;
    
    const baseAgeSelectBtnClass = "rounded-[60rem] p-[.8rem_1.8rem] text-[1.4rem] font-semibold text-textLight";

    // 연령/정렬 버튼의 활성화/비활성화 스타일 동적 생성
    const ActiveSelectBtnClass = (value: string, type: string) => {
        const isActive = type === "age" ? searchAge === value : sortType === value;
        const ageBtnClass = isActive ? "bg-main" : "bg-disabled hover:bg-hoverDisabled";
        const sortBtnClass = isActive ? "bg-blueActive" : "bg-disabled hover:bg-hoverDisabled";
        const bgClass = type === "age" ? ageBtnClass : sortBtnClass;

        return `${baseAgeSelectBtnClass} ${bgClass}`;
    };

    const ArrToBtn = (arr: any[], type: string) => {
        const setType = type === "age" ? setSearchAge : setSortType;
        
        const finalArr = type === "age" 
            ? [{ value: "", label: "전체" }, ...arr]
            : arr;

        return (
            finalArr.map(item => (
                <li key={item.value}> 
                    <button 
                        type="button"
                        className={ActiveSelectBtnClass(String(item.value), type)} 
                        onClick={() => setType(String(item.value))} 
                    >
                        {item.label}
                    </button>
                </li>
            ))
        );
    };

    const filteredPlans = getFilteredPlans(searchTit, searchAge, isSavedFilter, authorFilter, user);

    console.log(filteredPlans)

    // 필터링 로직: 검색어와 선택된 연령에 따라 plans 배열 필터링
    const displayedPlans = [...filteredPlans].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return sortType === "latest" ? dateB - dateA : dateA - dateB;
    });

    // 계획안 선택/해제 토글 함수
    const handleCheckToggle = (id: number) => {
        setCheckedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id] );
    };

    // 선택된 계획안들을 삭제하는 함수
    const handleRemove = async () => {
        // 1. 내가 쓴 글 ID 리스트와 남이 쓴 글 ID 리스트로 분류
        const myPlanIds = checkedIds.filter(id => {
            const plan = userPlans.find(p => p.id === id);
            return plan?.author === user?.userNickname; 
        });

        const collectedPlanIds = checkedIds.filter(id => {
            const plan = userPlans.find(p => p.id === id);
            return plan?.author !== user?.userNickname; 
        });

        console.log(myPlanIds)
        console.log(collectedPlanIds)

        // 2. 각각 다른 API 호출
        try {
            await deletePlans(myPlanIds); 

            // 남의 글들: 보관함에서 제거
            if (collectedPlanIds.length > 0) {
                await deletePlans(collectedPlanIds);
            }

            alert("삭제되었습니다.");
            setCheckedIds([]);
            // 목록 다시 불러오기 (fetchData 호출 등)
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    return (
        <div className="bg-bgCard flex flex-col h-[100%]">
            {/* 상단 헤더 */}
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">보관함</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">생성된 교육 계획안을 관리할 수 있습니다.</p>
            </div>

            {/* 검색 및 필터 컨트롤 영역 */}
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[1.8rem_2.6rem]">
                <div className="flex gap-[.4rem]">
                    <input type="text" value={searchTit} onChange={e => setSearchTit(e.target.value)} placeholder="주제로 계획안을 검색할 수 있습니다." />
                    {/* 선택된 항목이 있을 때만 삭제 버튼 활성화 */}
                    {!authorFilter && checkedIds.length >= 1 && (
                        <button onClick={handleRemove} className="rounded-[.8rem] w-[15rem] text-center p-[1rem_1.6rem] bg-red-600 text-textLight hover:bg-red-700 whitespace-nowrap text-[1.4rem]">선택 삭제 ({checkedIds.length}개)</button>
                    )}
                </div>

                <div className="flex justify-between items-center mt-[1.2rem]">
                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(AGE_OPTIONS, "age") }

                        <button 
                            onClick={() => setIsSavedFilter(!isSavedFilter)}
                            className={`ml-[1rem] text-white p-[0.6rem_1.2rem] rounded-[0.8rem] text-[1.4rem] font-bold border transition ${
                                isSavedFilter 
                                ? "bg-main" 
                                : "bg-mainLight"
                            }`}
                        >
                            {isSavedFilter ? "전체 보기" : "내가 작성한 계획안만 보기"}
                        </button>
                    </ul>

                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(SORT_OPTIONS, "type") }
                    </ul>
                </div>
            </div>

            {/* 계획안 목록 렌더링 영역 */}
            <div className="bg-bgPreview w-[100%] h-[100%] p-[2.6rem] flex-1">
                {displayedPlans.length >= 1 ? (
                    <>
                        <p className="text-textMuted text-[1.4rem] font-semibold mb-[1.2rem]">총 <span className="text-main font-bold">{displayedPlans.length}개</span>의 계획안</p>
                        <div className="grid gap-[1.8rem_1.6rem] grid-cols-4">
                            {displayedPlans.map((plan, idx) => {
                                if (!plan || !plan.id) return null;

                                return (
                                    <PlanItem 
                                        plan={plan} 
                                        key={`${plan.id}-${idx}`} 
                                        checkHandle={handleCheckToggle} 
                                        onClick={() => router.push(`/storage/${plan.id}`)} 
                                        authorFilter={authorFilter}
                                    />
                                );
                            })}
                        </div>
                    </>
                ) : (
                    // 데이터가 없을 때 표시할 UI
                    <>
                        <div className="mt-[10rem] text-center flex flex-col gap-[0.6rem] mb-[2.4rem]">
                            <p className="text-[1.8rem] font-bold text-[#212529]">보관된 계획안이 없습니다</p>
                            <p className="text-[1.4rem] font-medium text-[#868e96]">AI계획안을 생성해 보세요!</p>
                        </div>
                        <button className="btn-base mt-[4rem] block rounded-[60rem] bg-main-gradient text-textLight px-16 py-8 text-[1.6rem]" onClick={() => router.push('/workspace')}>
                            계획안 생성하기
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default page;