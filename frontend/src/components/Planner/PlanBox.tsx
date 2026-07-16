import { Plan } from "@/type/Plan";
import { useRouter } from "next/navigation";
import { FaUserLarge, FaHeart, FaEye } from "react-icons/fa6";
import { MdOutlineAccessTime } from "react-icons/md";
import { DOMAIN_STYLES } from "@/constants/activityOptions";

export default function PlanBox({ plan, idx }: { plan: Plan, idx: number }) {
    const router = useRouter();

    const handleNavigate = (id: number) => {
        sessionStorage.setItem("prevPath", "detail");
        router.push(`/storage/${id}`);
    }

    return (
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
    )
}
