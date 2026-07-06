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

function page() {
    const { id: planId } = useParams();
    const { planStorage, isLoaded, fetchPlanById, fetchPlansByAuthor, likePlan, addStorage, updatePlanViewCount, deletePlans } = usePlanStore();
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

    console.log(user)

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
    if (!isLoaded && planStorage.length === 0) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }
    if (!plan) return <div>존재하지 않거나 삭제된 계획안입니다.</div>;

    const baseBtnClass = "flex items-center text-[1.4rem] font-semibold cursor-pointer rounded-[0.8rem] p-[.8rem] min-w-[12rem] justify-center";

    // console.log("user:", user, plan)

    if (!plan) {
        return <div className="p-10 text-[1.6rem]">존재하지 않거나 삭제된 계획안입니다.</div>;
    };

    const currentPlanAuthor = plan.author;
    const currentAuthorPlans = planStorage.filter(p => p.author === currentPlanAuthor);

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
                                <div 
                                    key={idx}
                                    style={{ '--domain-line-color': `var(--color-cate${item.domain === "기본생활" || item.domain === "기본생활·신체" ? 0 : item.domain === "신체운동" || item.domain === "신체운동·건강" ? 1 : item.domain === "의사소통" ? 2 : item.domain === "사회관계" ? 3 : item.domain === "예술경험" ? 4 : 5})` } as React.CSSProperties}
                                    className="relative bg-bgCard rounded-[1.2rem] mb-[10rem] shadow-sm p-[3rem_3rem_3rem_4.5rem] before:content-[''] before:absolute before:top-0 before:left-0 before:w-[.8rem] before:h-[100%] before:rounded-[1.2rem_0_0_1.2rem] before:rounded-l-[1.2rem] before:bg-[var(--domain-line-color)]"
                                >
                                    <div className="flex gap-[1rem] items-center mb-[1rem]">
                                        <p className={`text-[1.2rem] inline-block p-[.8rem_1.2rem] font-semibold rounded-[60rem] ${DOMAIN_STYLES[item.domain as keyof typeof DOMAIN_STYLES]}`}>
                                            {item.domain}
                                        </p>

                                        <span className="text-textMuted text-[1.2rem] font-semibold">활동 {idx + 1} / {plan.plans.length}</span>
                                    </div>

                                    <p className="text-[2.4rem] my-[2rem] font-bold">{item.activityName}</p>

                                    <div className="mb-[2rem]">
                                        <p className="text-[2rem] font-semibold mb-[1rem]">기대 효과</p>
                                        <ul className="space-y-1 pl-[1rem] mb-[2.4rem]"> 
                                            {item.objectives.map((obj, idx) => (
                                                <li className="before:content-['•'] before:text-main before:mr-[.8rem] text-[1.6rem]" key={idx}>
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>

                                        <p className="text-[2rem] font-semibold mb-[1.2rem]">연계 교육과정</p>
                                        
                                        <div className="flex flex-col gap-[1.2rem] pl-[0.4rem]">
                                            {item.relatedCurriculum.map((curriculum, idx) => {
                                                const steps = curriculum.split(/\s*>\s*/); 

                                                return (
                                                    <div key={idx} className="flex flex-wrap items-center gap-[0.8rem] text-[1.4rem]">
                                                        {steps.map((step, stepIdx) => (
                                                            <div key={stepIdx} className="flex items-center gap-[0.8rem]">
                                                                <span className={`p-[0.4rem_1.2rem] rounded-[0.8rem] font-semibold tracking-tight ${
                                                                    stepIdx === 0 
                                                                        ? 'bg-blueActive/10 text-blueActive'
                                                                        : 'bg-[#f8f9fa] border border-solid border-[#eee] text-textMuted font-medium' 
                                                                }`}>
                                                                    {step}
                                                                </span>
                                                                
                                                                {stepIdx < steps.length - 1 && (
                                                                    <span className="text-[#bbb] text-[1.2rem] font-normal font-mono select-none">▶</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                <div className="mb-[2rem]">
                                        <p className="text-[2rem] font-semibold mb-[1.6rem]">활동 방법</p>
                                        
                                        <div className="flex flex-col gap-[2.4rem] pl-[0.4rem] relative before:content-[''] before:absolute before:left-[1.5rem] before:top-[1rem] before:w-[0.2rem] before:h-[calc(100%-2rem)] before:bg-[#eee]">
                                            
                                            {/* 도입 */}
                                            {item.introduction && (
                                                <div className="relative pl-[3.6rem] mb-[2rem]">
                                                    <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-blueActive border-[4px] border-solid border-white shadow-sm z-10" />
                                                    
                                                    <div className="flex flex-col gap-[0.8rem]">
                                                        <span className="text-[1.4rem] font-bold text-blueActive">도입</span>
                                                                                                            
                                                        <div className="bg-white border border-[#e9ecef] p-[2rem] rounded-[1.6rem] shadow-sm flex flex-col gap-[1.6rem]">
                                                            {/* 활동 내용 섹션 */}
                                                            <div className="flex flex-col gap-[0.6rem]">
                                                                <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                                                    <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-blueActive"></span>
                                                                    활동 내용
                                                                </h4>
                                                                <p className="text-[1.6rem] text-[#333] leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-[1.2rem] rounded-[0.8rem]">
                                                                    {item.introduction.description}
                                                                </p>
                                                            </div>

                                                            {/* 교사 발문 섹션 */}
                                                            <div className="flex flex-col gap-[0.6rem]">
                                                                <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                                                    <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-secondary"></span>
                                                                    교사 발문
                                                                </h4>
                                                                <div className="text-[1.6rem] text-[#444] leading-relaxed whitespace-pre-line border-l-4 border-secondary pl-[1.6rem] py-[0.4rem] italic bg-[#fffaf0]">
                                                                    "{item.introduction.teacherTalk}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 전개 */}
                                            {item.development && (
                                                <div className="relative pl-[3.6rem] mb-[2rem]">
                                                    <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-main border-[4px] border-solid border-white shadow-sm z-10" />
                                                    
                                                    <div className="flex flex-col gap-[0.6rem]">
                                                        <span className="text-[1.4rem] font-bold text-main">전개</span>
                                                        
                                                        <div className="bg-white border border-[#e9ecef] p-[2rem] rounded-[1.6rem] shadow-sm flex flex-col gap-[1.6rem]">
                                                            {/* 활동 내용 섹션 */}
                                                            <div className="flex flex-col gap-[0.6rem]">
                                                                <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                                                    <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-main"></span>
                                                                    활동 내용
                                                                </h4>
                                                                <p className="text-[1.6rem] text-[#333] leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-[1.2rem] rounded-[0.8rem]">
                                                                    {item.development.description}
                                                                </p>
                                                            </div>

                                                            {/* 교사 발문 섹션 */}
                                                            <div className="flex flex-col gap-[0.6rem]">
                                                                <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                                                    <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-secondary"></span>
                                                                    교사 발문
                                                                </h4>
                                                                <div className="text-[1.6rem] text-[#444] leading-relaxed whitespace-pre-line border-l-4 border-secondary pl-[1.6rem] py-[0.4rem] italic bg-[#fffaf0]">
                                                                    "{item.development.teacherTalk}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 마무리 */}
                                            {item.conclusion && (
                                                <div className="relative pl-[3.6rem]">
                                                    <div className="absolute left-[0.5rem] top-[0.4rem] w-[1.6rem] h-[1.6rem] rounded-full bg-gray-400 border-[4px] border-solid border-white shadow-sm z-10" />
                                                    <div className="flex flex-col gap-[0.6rem]">
                                                        <span className="text-[1.4rem] font-bold text-gray-500">마무리</span>
                                                        
                                                        <div className="bg-white border border-[#e9ecef] p-[2rem] rounded-[1.6rem] shadow-sm flex flex-col gap-[1.6rem]">
                                                            {/* 활동 내용 섹션 */}
                                                            <div className="flex flex-col gap-[0.6rem]">
                                                                <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                                                    <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-gray-500"></span>
                                                                    활동 내용
                                                                </h4>
                                                                <p className="text-[1.6rem] text-[#333] leading-relaxed whitespace-pre-line bg-[#f8f9fa] p-[1.2rem] rounded-[0.8rem]">
                                                                    {item.conclusion.description}
                                                                </p>
                                                            </div>

                                                            {/* 교사 발문 섹션 */}
                                                            <div className="flex flex-col gap-[0.6rem]">
                                                                <h4 className="text-[1.4rem] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-[0.6rem]">
                                                                    <span className="w-[0.8rem] h-[0.8rem] rounded-full bg-secondary"></span>
                                                                    교사 발문
                                                                </h4>
                                                                <div className="text-[1.6rem] text-[#444] leading-relaxed whitespace-pre-line border-l-4 border-secondary pl-[1.6rem] py-[0.4rem] italic bg-[#fffaf0]">
                                                                    "{item.conclusion.teacherTalk}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    <div className="flex gap-[1.6rem] my-[1.6rem]">
                                        <div className="flex-1 border-solid border-[.2rem] bg-[#ddeaf9] border-[#86bcff] p-[2rem] rounded-[1.2rem]">
                                            <p className="text-[1.8rem] font-bold text-[#1e40af] mb-[1.2rem]"><span className="text-[2rem]">🎒</span> 준비물</p>

                                            <ul className="flex flex-wrap gap-[0.8rem]">
                                                {item.materials.map((data, idx) => (
                                                    <li 
                                                        className="text-[1.4rem] font-semibold rounded-[60rem] bg-bgCard p-[0.6rem_1.4rem] border-[#86bcff] border-solid border text-[#2563eb] shadow-sm" 
                                                        key={idx}
                                                    >
                                                        {data}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {item.precautions && item.precautions.length > 0 && (
                                            <div className="flex-1 border-solid border-[.2rem] bg-[#fff5f5] border-[#feb2b2] p-[2rem] rounded-[1.2rem]">
                                                <p className="text-[1.8rem] font-bold text-[#9b2c2c] mb-[1rem] flex items-center gap-[0.6rem]">
                                                    <span className="text-[2rem]">⚠️</span> 유의 사항
                                                </p>
                                                <ul className="space-y-1.5 pl-[0.4rem]">
                                                    {item.precautions.map((pre, idx) => (
                                                        <li 
                                                            className="text-[1.5rem] text-[#4a5568] font-medium leading-relaxed before:content-['•'] before:text-[#e53e3e] before:mr-[0.8rem]" 
                                                            key={idx}
                                                        >
                                                            {pre}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {item.extensionActivity && (
                                            <div className="flex-1 border-solid border-[.2rem] bg-[#f3f0ff] border-[#d6bbfb] p-[2rem] rounded-[1.2rem]">
                                                <p className="text-[1.8rem] font-bold text-[#5b21b6] mb-[1rem] flex items-center gap-[0.6rem]">
                                                    <span className="text-[2rem]">✨</span> 확장 활동
                                                </p>
                                                <div className="pl-[0.4rem] text-[1.5rem] text-[#4a5568] font-medium leading-relaxed">
                                                    {item.extensionActivity}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default page