'use client';

import { FaEye, FaRegBookmark, FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { FcLike } from 'react-icons/fc';
import { Plan } from "@/type/Plan";

export const MyPlanInfo = ({ currentAuthorPlans }: { currentAuthorPlans: Plan[] }) => {
    
    const utilItemClass = "flex px-[1.6rem] gap-[.4rem] text-[1.6rem] font-bold items-center"
    const utilBtnClass = "flex gap-[.4rem] items-center justify-center rounded-[.8rem] text-[1.6rem] font-semibold p-[1rem_1.8rem] w-full bg-[#e6e6e6] hover:bg-[#e5dbff]";

    return (
        <div className="bg-bgCard mb-[2rem] rounded-[1.2rem] shadow-sm p-[2rem] flex justify-between items-center">
            <div className="mr-auto text-[1.6rem] font-semibold text-textMuted">총 작성한 계획안 <span className="text-mainLight font-bold">{currentAuthorPlans.length}개</span></div>    
            <div className="flex items-center after:content-[''] after:w-[.1rem] after:h-[3rem] after:bg-[#e6e6e6] after:mx-[2rem]">
                <div className={`${utilItemClass} text-[#777]`}><FaEye className="text-[3rem] mr-[.4rem]" /> 2</div>
                <div className={`${utilItemClass} text-[#e97171]`}><FcLike className="text-[3rem] mr-[.4rem]" /> 2</div>
                <div className={`${utilItemClass} text-[#c28feb] pr-0`}><FaRegBookmark className="text-[3rem] mr-[.4rem]" /> 2</div>
            </div>
            <div className="flex gap-[1rem]">
                <button className={utilBtnClass}><FaPencilAlt />수정하기</button>
                <button className={utilBtnClass}><FaTrashAlt /> 삭제하기</button>
            </div>
        </div>
    )
}