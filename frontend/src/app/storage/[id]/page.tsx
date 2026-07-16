"use client";

import { useParams, useRouter } from 'next/navigation';
import { usePlanStore } from '@/store/usePlanStore'; 
import { IoArrowBackOutline } from "react-icons/io5";
import { DOMAIN_STYLES } from '@/constants/activityOptions';
import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '@/store/useUiStore';
import EditModal from '@/components/Modal/modalContents/EditModal';
import { useWelcomeStore } from '@/store/useWelcomeStore';
import { AnotherPlanInfo } from '@/components/Storage/AnotherPlanInfo';
import { MyPlanInfo } from '@/components/Storage/MyPlanInfo';
import TextModal from '@/components/Modal/modalContents/TextModal';
import PlanDetail from '@/components/Planner/PlanDetail';

function page() {
    const { id: planId } = useParams();
    const { planStorage, isLoaded, fetchPlanById, userPlans, updatePlanViewCount, deletePlans } = usePlanStore();
    const { openModal, closeModal } = useUiStore();
    const { user } = useWelcomeStore();

    const router = useRouter();

    const hasIncreasedRef = useRef(false);
    const pdfRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPlanById(Number(planId));

        if (!hasIncreasedRef.current) {
            updatePlanViewCount(Number(planId));
            hasIncreasedRef.current = true;
        }
    }, [planId]);

    // useEffect(() => {
    //     console.log("현재 planId:", planId);
    //     console.log("planStorage 내용:", planStorage);
    //     console.log("찾은 plan:", plan);
    // }, [planStorage, planId]);
        
    const [ageGroup, setAgeGroup] = useState<string>("");

    const plan = planStorage.find(p => p.id === Number(planId));

    // console.log(userPlans)

    useEffect(() => {
        if (!plan?.age) return;
        const ageMatch = plan?.age.match(/\d+/);
        if (ageMatch) {
            const ageNum = parseInt(ageMatch[0], 10);
            const group = ageNum < 3 ? "영아" : "유아"; 
            setAgeGroup(group); 
        }
    }, [plan]);

    if (!user) return <div>로그인이 필요한 페이지입니다.</div>;
    if (!plan) return <div>존재하지 않거나 삭제된 계획안입니다.</div>;

    const baseBtnClass = "flex items-center text-[1.4rem] font-semibold cursor-pointer rounded-[0.8rem] p-[.8rem] min-w-[12rem] justify-center";

    // console.log("user:", user, plan)

    if (!plan) {
        return <div className="p-10 text-[1.6rem]">존재하지 않거나 삭제된 계획안입니다.</div>;
    };

    const currentPlanAuthor = plan.author;
    const currentAuthorPlans = planStorage.filter(p => p.author === currentPlanAuthor);

    // console.log(currentAuthorPlans)

    const handleEdit = () => {
        openModal(
            "계획안 수정",
            "CONFIRM",
            <EditModal plan={plan} />
        );
    };

    const handleDelete = async () => {
        openModal(
            "계획안 삭제",
            "CONFIRM",
            <TextModal 
                txt={"계획안을 삭제하시겠습니까?"} 
                onConfirm={async () => {
                    try {
                        await deletePlans([plan.id]);

                        closeModal();
                        openModal(
                            "계획안 삭제",
                            "CHECK",
                            <TextModal txt={"성공적으로 삭제되었습니다."} onConfirm={() => {
                                closeModal();
                                router.push('/storage');
                            }} />
                        )
                    } catch (err) {
                        closeModal();
                        openModal("오류", "CHECK", <TextModal txt={"삭제 중 오류가 발생했습니다."} onConfirm={() => {
                            closeModal();
                            router.push('/storage');
                        }} />)
                    }
                }} 
            />
        )
    };

    const handleDownloadPdf = async () => {
        window.open(`/pdf-view/${plan.id}`, '_blank');
    };
    
    if (!plan) return <div>Plan not found</div>

    const isAuthor = plan.author === user.userNickname;

    return (
        <>
            <div className="bg-bgPreview flex flex-col h-[100%]">
                <div className="bg-bgCard p-[1.6rem_0] border-b-[.1rem] border-solid border-[#eee]">
                    <div className="w-[70%] mx-auto flex justify-between ">
                        <button className="flex items-center text-[2rem] font-bold" onClick={() => window.history.back()}>
                            <IoArrowBackOutline className="mr-[1rem]" />
                            보관함으로 돌아가기
                        </button>

                        <div className="flex gap-[1rem]">
                            <button className={`${baseBtnClass} bg-[#eee] hover:bg-[#dbdbdb]`}>
                                인쇄
                            </button>
                            {/* <button onClick={handleDownloadPdf} className={`${baseBtnClass} bg-blueActive hover:bg-[#1f69ca] text-textLight`}>
                                pdf 내보내기
                            </button> */}

                            { plan.author === user.userNickname && (
                                <>
                                    <button onClick={handleEdit} className={`${baseBtnClass} bg-main hover:bg-hoverMain text-textLight`}>
                                        활동 수정
                                    </button>
                                    <button onClick={handleDelete} className={`${baseBtnClass} bg-red-600 hover:bg-red-700 text-textLight`}>
                                        삭제
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-[70%] mx-auto mt-[2rem] flex-1">
                    <div className="bg-main-gradient p-[3rem] rounded-[1.2rem] mb-[2rem]">
                        <p className="text-textLight text-[2.8rem] font-bold mb-[1.2rem]">{plan.mainTheme}</p>
                        <ul className="mb-[1.2rem] flex items-center">
                            <li className="text-textLight text-[1.6rem]">👶 {plan.age}</li>
                            <li className="before:content-['•'] before:mr-[.8rem] text-textLight text-[1.6rem]">{plan.plans.length}개 활동</li>
                        </ul>
                        <ul className="flex gap-[1rem]">
                            {plan.plans.map((item: any, idx: number) => {
                                const domainKeys = Object.keys(DOMAIN_STYLES);
                                const foundKey = domainKeys.find(key => item.domain.includes(key));
                                const domainStyle = foundKey ? DOMAIN_STYLES[foundKey as keyof typeof DOMAIN_STYLES] : ""

                                return  <li key={`${item}-${idx}`} className={`${domainStyle} p-[.8rem_1.2rem] rounded-[60rem] font-semibold text-[1.2rem]`}>{item.domain}</li>
                            })}
                        </ul>
                    </div>

                    {isAuthor ? (
                        <MyPlanInfo currentAuthorPlans={currentAuthorPlans} />
                    ) : (
                        <AnotherPlanInfo plan={plan} currentAuthorPlans={currentAuthorPlans} />
                    )}

                    <div ref={pdfRef}>
                        <div className="bg-bgCard rounded-[1.2rem] mb-[2rem] shadow-sm p-[3rem]">
                            <p className="text-[2.4rem] font-bold mb-[1rem]">활동 개요</p>
                            <div className="text-[1.6rem] text-textMuted font-semibold">{plan.activeIntro}</div>
                        </div>

                        {plan.plans.map((item, idx) => {
                            // console.log(item)
                            // const domainStyle = DOMAIN_STYLES[item.domain];
                            // console.log(domainStyle)
                            return (
                                <PlanDetail key={idx} item={item} idx={idx} plan={plan} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page