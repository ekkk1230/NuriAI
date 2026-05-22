'use client';

import { useState } from "react";
import { usePlanStore } from "../store/usePlanStore"
import { AGE_OPTIONS } from "../constance/activityOptions";
import PlanItem from "../components/Planner/PlanItem";

const SORT_OPTIONS = [
    { value: "latest", label: "최신 순" },
    { value: "oldest", label: "오래된 순" },
];

function page() {
    const { planStorage } = usePlanStore();
    const [searchTit, setSearchTit]  = useState<string>("");
    const [searchAge, setSearchAge] = useState<string>("");
    const [sortType, setSortType] = useState<string>("latest");

    const baseAgeSelectBtnClass = "rounded-[60rem] p-[.8rem_1.8rem] text-[1.4rem] font-semibold text-textLight";

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
                        value={item.value}
                    >
                        {item.label}
                    </button>
                </li>
            ))
        )
    };

    // console.log(planStorage)
    return (
        <div className="bg-bgCard">
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">보관함</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">생성된 교육 계획안을 관리할 수 있습니다.</p>
            </div>

            <div className="border-b-[.1rem] border-solid border-[#eee] p-[1.8rem_2.6rem]">
                <input type="text" value={searchTit} onChange={e => setSearchTit(e.target.value)} placeholder="주제로 계획안을 검색할 수 있습니다." />

                <div className="flex justify-between items-center mt-[1.2rem]">
                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(AGE_OPTIONS, "age") }
                    </ul>

                    <ul className="space-x-[.6rem] flex">
                        { ArrToBtn(SORT_OPTIONS, "type") }
                    </ul>
                </div>
            </div>

            <div className="bg-bgPreview w-[100%] h-[100%] p-[2.6rem]">
                {planStorage.length >= 1 ? (
                    <div className="grid gap-[1.8rem_1.6rem] grid-cols-4">
                        {planStorage.map((plan, index) => (<PlanItem plan={plan} key={`${index}`} />))}
                    </div>
                ) : (
                    "no"
                )}
            </div>
        </div>
    )
}

export default page