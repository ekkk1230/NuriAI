'use client';

import { FaSave, FaRegSave, FaEye, FaRegBookmark } from "react-icons/fa";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FcLike } from 'react-icons/fc';
import { Plan } from "@/type/Plan";
import { usePlanStore } from "@/store/usePlanStore";
import { useRouter } from 'next/navigation';
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { useEffect } from "react";


export const AnotherPlanInfo = ({ plan, currentAuthorPlans }: { plan: Plan, currentAuthorPlans: Plan[] }) => {
    const route = useRouter();
    const { user } = useWelcomeStore();
    const { fetchPlansByAuthor, fetchPlanById, likePlan, addStorage, authorPlans } = usePlanStore();

    useEffect(() => {
        fetchPlansByAuthor(plan);
    }, [plan]);

    // console.log(authorPlans)

    if (!user) return <div>로그인이 필요한 페이지입니다.</div>;

    
    const handleFetchPlansByAuthor = async () => {
        try {
            await fetchPlansByAuthor(plan);
        } catch (err) {
            console.error(`작성자 계획안 조회 실패: ${err}`);
        }
        
        route.push(`/storage?author=${encodeURIComponent(plan.author)}`);
    };
    
    const handleLike = async () => { 
        try {
            await likePlan(user, plan); 
        } catch (err) {
            console.error(`handleLike 실패: ${err}`);
        }
    };
    
    const handleSave = async () => {
        try {
            await addStorage(user, plan);
            await fetchPlanById(plan.id); 
        } catch (err) {
            console.error(`handleSave 실패: ${err}`)
        }
    }
    
    // console.log(plan.savedUserIds)
    // console.log(user)
    const utilBtnClass = "flex items-center justify-center gap-[.4rem] rounded-[.8rem] text-[1.6rem] font-semibold p-[1rem_1.8rem] w-full transition-colors";
   
    // 상태 확인
    const isLiked = plan.likeUserIds.includes(user.id!);
    const isSaved = plan.savedUserIds.includes(user.id!);

    // 좋아요 활성화
    const likeActiveClass = isLiked 
    ? "bg-blue-200 text-blue-800 hover:bg-blue-200 font-bold" 
    : "bg-blue-100 hover:bg-blue-200";

    // 보관하기 활성화
    const saveActiveClass = isSaved 
        ? "bg-purple-200 text-purple-800 hover:bg-purple-200 font-bold" 
        : "bg-purple-100 hover:bg-purple-200";

    return (
        <div className="grid grid-cols-3 gap-[2rem] mb-[2rem]">
            <div className="bg-bgCard rounded-[1.2rem] p-[2rem] shadow-sm flex flex-col">
                <div className="flex items-center justify-center mb-[2rem] gap-[2rem]">
                    <div className="flex flex-col w-[100%] items-center relative gap-[.4rem] font-semibold text-[1.6rem] font-semibold after:content-[''] after:w-[.1rem] after:h-[100%] after:bg-[#dbdbdb] after:absolute after:right-[-1rem] after:top-0">
                        <p className="text-textMuted text-[1.2rem]">작성자</p>
                        <p className="font-bold">{plan.author}</p>
                    </div>
                    <div className="flex flex-col w-[100%] items-center gap-[.4rem] text-[1.6rem] font-semibold">
                        <p className="text-textMuted text-[1.2rem]">작성한 계획안</p>
                        <p className="font-bold">{authorPlans.length}개</p>
                    </div>
                </div>
                <button 
                    type="button" 
                    className={`
                        text-[1.4rem] font-semibold p-[1.2rem] rounded-[.8rem] 
                        border-solid border-[.2rem] 
                        ${plan.author === "탈퇴한 사용자" ? `text-textMuted border-[#dbd8de] bg-[#ececec]` : `text-mainLight border-[#e9d4ff] bg-[#faf5ff]`}
                    `
                    }
                    onClick={() => handleFetchPlansByAuthor()}
                    disabled={plan.author === "탈퇴한 사용자" ? true : false}
                >
                    {plan.author} 선생님이 작성한 계획안 보러가기
                </button>
            </div>

            <div className="bg-bgCard rounded-[1.2rem] p-[2rem] shadow-sm flex">
                <div className="w-full flex items-center justify-center flex-col gap-[1rem]">
                    <FcLike className="text-[3rem]" />
                    <p className="text-[1.6rem] font-bold">{plan.likeCount}</p>
                </div>
                <div className="w-full flex items-center justify-center flex-col gap-[1rem]">
                    <FaEye className="text-[3rem]" />
                    <p className="text-[1.6rem] font-bold">{plan.viewCount}</p>
                </div>
                <div className="w-full flex items-center justify-center flex-col gap-[1rem]">
                    <FaRegBookmark className="text-[3rem]" />
                    <p className="text-[1.6rem] font-bold">{plan.saveCount}</p>
                </div>
            </div>
            
            <div className="bg-bgCard rounded-[1.2rem] p-[2rem] shadow-sm gap-[1rem] items-stretch flex items-center justify-center">
                <button 
                    type="button" 
                    onClick={handleLike} 
                    className={`
                        ${utilBtnClass} 
                        ${likeActiveClass}
                        ${plan.author === "탈퇴한 사용자" ? "!text-textMuted !border-[.1rem] !border-[#dbd8de] !bg-[#ececec]" : ""}    
                    `}
                    disabled={plan.author === "탈퇴한 사용자" ? true : false}
                >
                    {plan.likeUserIds.includes(user.id!) ? <AiFillLike /> : <AiOutlineLike />} 
                    좋아요
                </button>

                <button 
                    type="button" 
                    onClick={handleSave}
                    className={`
                        ${utilBtnClass} 
                        ${saveActiveClass}
                        ${plan.author === "탈퇴한 사용자" ? "!text-textMuted !border-[.1rem] !border-[#dbd8de] !bg-[#ececec]" : ""}    
                    `}
                    disabled={plan.author === "탈퇴한 사용자" ? true : false}
                >
                    {plan.savedUserIds.includes(user.id!) ? <FaSave /> : <FaRegSave />}
                    보관하기
                </button>
            </div>
        </div>
    )
}