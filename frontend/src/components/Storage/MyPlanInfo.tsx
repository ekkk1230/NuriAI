'use client';

import { FaEye, FaRegBookmark, FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { FcLike } from 'react-icons/fc';
import { Plan } from "@/type/Plan";
import EditModal from "../Modal/modalContents/EditModal";
import { useUiStore } from "@/store/useUiStore";
import { usePlanStore } from "@/store/usePlanStore";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { useEffect } from "react";

export const MyPlanInfo = ({ currentAuthorPlans }: { currentAuthorPlans: Plan[] }) => {
    const { openModal } = useUiStore();
    const { user } = useWelcomeStore();
    const { userPlans, planStorage, fetchUserPlans } = usePlanStore();

    useEffect(() => {
        if (user) {
            fetchUserPlans(user);
        }
    }, [])

    console.log(user)

    const utilItemClass = "flex px-[1.6rem] gap-[.4rem] text-[1.6rem] font-bold items-center"
    const utilBtnClass = "flex gap-[.4rem] items-center text-textLight justify-center rounded-[.8rem] text-[1.6rem] font-semibold p-[1rem_1.8rem] w-full";

    const handleEdit = () => {
        openModal(
            "계획안 수정",
            "CONFIRM",
            <EditModal plan={currentAuthorPlans[0]} />
        );
    };

    return (
        <div className="bg-bgCard mb-[2rem] rounded-[1.2rem] shadow-sm p-[2rem] flex justify-between items-center">
            <div className="mr-auto text-[1.6rem] font-semibold text-textMuted">총 작성한 계획안 <span className="text-mainLight font-bold">{userPlans.length}개</span></div>    
            <div className="flex items-center after:content-[''] after:w-[.1rem] after:h-[3rem] after:bg-[#e6e6e6] after:mx-[2rem]">
                <div className={`${utilItemClass} text-[#777]`}><FaEye className="text-[3rem] mr-[.4rem]" /> {currentAuthorPlans[0].viewCount}</div>
                <div className={`${utilItemClass} text-[#e97171]`}><FcLike className="text-[3rem] mr-[.4rem]" /> {currentAuthorPlans[0].likeCount}</div>
                <div className={`${utilItemClass} text-[#c28feb] pr-0`}><FaRegBookmark className="text-[3rem] mr-[.4rem]" /> {currentAuthorPlans[0].saveCount}</div>
            </div>
            <div className="flex gap-[1rem]">
                <button className={`${utilBtnClass} bg-blue-400 hover:bg-blue-600`} onClick={handleEdit}><FaPencilAlt />수정하기</button>
                <button className={`${utilBtnClass} bg-red-400 hover:bg-red-600`}><FaTrashAlt /> 삭제하기</button>
            </div>
        </div>
    )
}