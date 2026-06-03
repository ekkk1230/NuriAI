'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { usePlanStore } from "@/store/usePlanStore"; 
import { AGE_OPTIONS } from "@/constants/activityOptions"; 
import PlanItem from "@/components/Planner/PlanItem";
import { useWelcomeStore } from "@/store/useWelcomeStore";

const SORT_OPTIONS = [
    { value: "latest", label: "최신 순" },
    { value: "oldest", label: "오래된 순" },
];

function page() {
    const router = useRouter();
    const { userPlans, isLoaded, deleteSelectedPlans, fetchUserPlans } = usePlanStore();
    const { user } = useWelcomeStore();
    
    const [searchTit, setSearchTit]  = useState<string>("");
    const [searchAge, setSearchAge] = useState<string>("");
    const [sortType, setSortType] = useState<string>("latest");
    const [checkedIds, setCheckedIds] = useState<number[]>([]);

    useEffect(() => {
        if (user) {
            fetchUserPlans(user);
        }
    }, [user, fetchUserPlans]);

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

    const filteredPlans = userPlans.filter(plan => {
        const matchesTitle = searchTit ? plan.mainTheme.includes(searchTit) : true;
        const matchesAge = (!searchAge || searchAge === "전체") 
            ? true 
            : plan.age === `만 ${searchAge}세`;

        return matchesTitle && matchesAge;
    })

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
    const handleRemove = () => {
        deleteSelectedPlans(checkedIds);
        setCheckedIds([]); // 삭제 후 선택 상태 초기화
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
                    {checkedIds.length >= 1 && <button onClick={handleRemove} className="rounded-[.8rem] w-[15rem] text-center p-[1rem_1.6rem] bg-red-600 text-textLight hover:bg-red-700 whitespace-nowrap text-[1.4rem]">선택 삭제 ({checkedIds.length}개)</button>}
                </div>

                <div className="flex justify-between items-center mt-[1.2rem]">
                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(AGE_OPTIONS, "age") }
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
                            {displayedPlans.map((plan) => {
                                if (!plan || !plan.id) return null; // 데이터 유효성 검사

                                return (
                                    <PlanItem 
                                        plan={plan} 
                                        key={plan.id} 
                                        checkHandle={handleCheckToggle} 
                                        onClick={() => router.push(`/storage/${plan.id}`)} 
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
                        <button type="button" className="..." onClick={() => router.push('/workspace')}>
                            첫 계획안 만들러 가기
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default page;