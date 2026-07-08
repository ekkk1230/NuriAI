import { usePlanStore } from "@/store/usePlanStore"
import { useWelcomeStore } from "@/store/useWelcomeStore";
import Link from "next/link";
import { useEffect } from "react";
import { PiBookOpenTextLight } from "react-icons/pi";
import { LuEye } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { ContentBox } from "./ContentBox";
import { FaArrowRight } from "react-icons/fa6";
import NoPlan from "../Planner/NoPlan";

export default function MyPlanList() {
    const { user } = useWelcomeStore();
    const { fetchUserPlans, userPlans } = usePlanStore();

    useEffect(() => {
        if (user) fetchUserPlans(user);
    }, [user, fetchUserPlans]);

    if (!user) return <div>회원정보를 찾을 수 없습니다.</div>

    return (
        <ContentBox title="내가 쓴 계획안">
            {userPlans.length >= 1 
                ? (
                    <>
                        <ul>
                            {userPlans.slice(0, 4).map(p => (
                                <li key={p.id} className="relative flex flex-wrap flex-row items-center w-full p-[1.4rem_1.2rem]">
                                    <div className="w-[5rem] h-[5rem] flex items-center justify-center bg-act0 rounded-[1.2rem] mr-[1.6rem]">
                                        <PiBookOpenTextLight className="text-act0-text text-[3rem]" />
                                    </div>
                                    <div className="w-[calc(100%-6.6rem)]">
                                        <Link href={`/storage/${p.id}`}>
                                            <p className="font-bold text-[1.6rem] mb-[.4rem]">{p.mainTheme}</p>
                                        </Link>
                                        <div className="flex gap-[1rem] font-semibold text-textMuted">
                                            <p className="text-[1.4rem]">{p.plans.map(plan => ( plan.domain ))}</p>
                                            <p className="text-[1.4rem]">{p.age}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-[50%] right-0 translate-[-50%]">
                                        <div className="flex items-center text-[1.4rem] text-[#777] gap-[.8rem]"><LuEye className="text-[1.4rem] text-[#777]" /><span className="font-bold min-w-[2rem]">{p.viewCount}</span></div>
                                        <div className="flex items-center text-[1.4rem] text-[#d020e4] gap-[.8rem]"><CiHeart className="text-[1.4rem] text-[#d020e4]" /><span className="font-bold min-w-[2rem]">{p.likeCount}</span></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Link href="/storage" className="flex gap-[.4rem] items-center absolute top-[2rem] right-[2rem] !text-mainLight text-[1.4rem] font-semibold">전체 보기 <FaArrowRight className="text-mainLight text-[1.2rem]" /></Link>
                    </>
                )
                : (
                    <NoPlan txt="현재 작성된 계획안이 없습니다." />
                )
            }
        </ContentBox>
    )
}
