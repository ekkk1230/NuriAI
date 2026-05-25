'use client';

import { useState } from "react";
import { usePlanStore } from "../store/usePlanStore";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp  } from "react-icons/md";

export const MOCK_INQUIRIES: any[] = [
    {
        id: 2,
        title: "AI 계획안 생성 시 누리과정 특정 영역 제외 가능 여부",
        inquiryContent: "안녕하세요! nuriAI 서비스로 '봄의 곤충' 대주제 계획안을 추출하고 있는데요. 이번 주차에는 '예술경험' 영역을 제외하고 '의사소통'과 '자연탐구' 2개 영역 위주로만 AI 학습 모델을 정렬하여 계획안을 생성하고 싶습니다. 특정 누리과정 영역을 선택 해제하는 필터 기능이 지원되는지 문의드립니다.",
        status: "PENDING",
        createdAt: "2026-05-23"
    },
    {
        id: 1,
        title: "생성된 교수학습 계획안의 연령 기준 변경 안내 요청",
        inquiryContent: "AI가 생성해 준 계획안 퀄리티가 너무 좋아서 만족하며 사용 중입니다! 한 가지 궁금한 점이 있는데, '만 5세' 유아 대상 계획안으로 잘못 선택해서 생성을 완료했습니다. 이미 완성된 계획안의 연령 설정을 '만 3세'로 변경하여 AI 발문이나 기대 효과를 재추출하는 기능이 있을까요? 아니면 새로 생성권을 차감해야 하는지 답변 부탁드립니다.",
        status: "ANSWERED", 

        createdAt: "2026-05-20",
        answer: {
            answerContent: "안녕하세요, 선생님! nuriAI 교수학습 서비스를 이용해 주시고 긍정적인 피드백을 남겨주셔서 진심으로 감사드립니다. 문의하신 '연령 설정 변경 및 재추출'의 경우, 현재 시스템 구조상 이미 생성이 완료된 계획안의 연령을 마이페이지에서 직접 변경하는 것은 어렵습니다. 유아 연령별 발문(교사 대사) 및 누리과정 연계 성취 기준 데이터가 다르게 파싱되기 때문인데요. 번거로우시겠지만 새로운 연령으로 '재생성'을 진행해 주셔야 하며, 잘못 생성된 계획안의 생성권 복구 조치를 위해 가입하신 계정 정보와 함께 고객센터로 메일 주시면 신속히 처리해 드리겠습니다. 감사합니다!",
            answeredAt: "2026-05-21"
        }
    }
];

function page() {
    const { planStorage } = usePlanStore();
    const [answerOpen, setAnswerOpen] = useState<Record<number, boolean>>({});
    
    const useItemBoxClass = "rounded-[.8rem] p-[1.6rem_1rem] flex-1 text-center";
    const statusClass = "rounded-[60rem] p-[.8rem_1.2rem]";
    const isActiveStatus = "bg-[#eeffe6] text-[#309e8c]";
    const noActiveStatus = "bg-[#fffbf3] text-[#e28c0c]";

    const toggleAnswer = (id: number) => {
        setAnswerOpen((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="bg-bgCard flex flex-col h-[100%]">
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">마이페이지</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">NuriAI 이용 정보를 확인할 수 있습니다.</p>
            </div>
            
            <div className="bg-bgPreview flex-1 pt-[4rem]">
                <div className="bg-bgCard w-[60%] mx-auto mb-[4rem] p-[2rem] rounded-[1.2rem] shadow-sm">
                    <p className="text-[2rem] font-semibold mb-[1.2rem]">이용 현황</p>

                    <ul className="flex gap-[1.2rem]">
                        <li className={`${useItemBoxClass} bg-[#f0deff]`}>
                            <p className="text-[3rem] mb-[2rem] font-bold text-[#8146b9]">{planStorage.length}</p>
                            <p className="text-[1.6rem] font-semibold text-textMuted">생성한 계획안</p>
                        </li>
                        <li className={`${useItemBoxClass} bg-[#def3ff]`}>
                            <p className="text-[3rem] mb-[2rem] font-bold text-[#375ea8]">{planStorage.length}</p>
                            <p className="text-[1.6rem] font-semibold text-textMuted">보관함 저장</p>
                        </li>
                        <li className={`${useItemBoxClass} bg-[#eeffe6]`}>
                            <p className="text-[3rem] mb-[2rem] font-bold text-[#309e8c]">{planStorage.length}</p>
                            <p className="text-[1.6rem] font-semibold text-textMuted">PDF 다운로드</p>
                        </li>
                    </ul>
                </div>

                <div className="bg-bgCard w-[60%] mx-auto p-[2rem] rounded-[1.2rem] shadow-sm relative">
                    <p className="text-[2rem] font-semibold mb-[1.2rem]">문의 게시판</p>

                    <button className="bg-main text-textLight text-[1.2rem] p-[.8rem_1rem] rounded-[.8rem] absolute right-[2rem] top-[2rem]">문의하기</button>

                    <ul className="mt-[2.8rem]">
                        {MOCK_INQUIRIES.length >= 1 ? (
                            MOCK_INQUIRIES.map(item => (
                                <li key={item.id} className="border-b border-solid border-[#eee] last:border-b-0 py-[1rem]">
                                    <button 
                                        onClick={() => toggleAnswer(item.id)} 
                                        className="flex items-center text-[1.4rem] w-full gap-[1rem]"
                                    >
                                        <p className="mr-auto font-semibold">{item.title}</p>
                                        <p className="text-textMuted">{item.createdAt}</p>
                                        <p className={`${statusClass} ${item.status === "ANSWERED" ? isActiveStatus : noActiveStatus}`}>
                                            {item.status === "ANSWERED" ? "답변완료" : "답변대기"}
                                        </p>
                                        <span className={`transition-transform duration-200 ${answerOpen[item.id] ? "rotate-0" : "rotate-180"}`}>
                                            <MdOutlineKeyboardArrowUp />
                                        </span>
                                    </button>
                                    
                                    {answerOpen[item.id] && (
                                        <>
                                             <div className="rounded-[.8rem] my-[1rem] bg-[#f7f7f7] p-[1rem] text-[1.2rem]">
                                                <p className="font-semibold text-[#333] mb-[.6rem]">문의 내용</p>
                                                <div className="">{item.inquiryContent}</div>
                                            </div>

                                            
                                            {item.answer ? (
                                                <div className="bg-[#ecdbff] text-textMuted p-[1rem] text-[1.2rem] rounded-[.8rem]">
                                                    <p className="text-main font-semibold">답변</p>
                                                    <div>{item.answer.answerContent}</div>
                                                </div>
                                            ) : (
                                                <div className="bg-[#fffbf3] text-[#e28c0c] p-[1rem] text-[1.2rem] rounded-[.8rem]">답변을 준비중 입니다. 잠시만 기다려 주세요.</div>
                                            )}
                                        </>
                                    )}
                                </li>
                            ))
                        ) : (
                            "없음"
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default page