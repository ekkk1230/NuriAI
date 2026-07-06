import { API_ROUTES } from "@/constants/api";
import { User } from "@/type/User";
import { apiFetch } from "@/util/api";
import { create } from "zustand";

const MOCK_INQUIRIES: any[] = [
    {
        id: 2,
        title: "AI 계획안 생성 시 누리과정 특정 영역 제외 가능 여부",
        inquiryContent: "안녕하세요! nuriAI 서비스로 '봄의 곤충' 대주제 계획안을 추출하고 있는데요. 이번 주차에는 '예술경험' 영역을 제외하고 '의사소통'과 '자연탐구' 2개 영역 위주로만 AI 학습 모델을 정렬하여 계획안을 생성하고 싶습니다. 특정 누리과정 영역을 선택 해제하는 필터 기능이 지원되는지 문의드립니다.",
        status: "PENDING",
        createdAt: "2026-05-23",
        updatedAt: "2026-05-23"
    },
    {
        id: 1,
        title: "생성된 교수학습 계획안의 연령 기준 변경 안내 요청",
        inquiryContent: "AI가 생성해 준 계획안 퀄리티가 너무 좋아서 만족하며 사용 중입니다! 한 가지 궁금한 점이 있는데, '만 5세' 유아 대상 계획안으로 잘못 선택해서 생성을 완료했습니다. 이미 완성된 계획안의 연령 설정을 '만 3세'로 변경하여 AI 발문이나 기대 효과를 재추출하는 기능이 있을까요? 아니면 새로 생성권을 차감해야 하는지 답변 부탁드립니다.",
        status: "ANSWERED", 

        createdAt: "2026-05-20",
        updatedAt: "2026-05-20",
        answer: {
            answerContent: "안녕하세요, 선생님! nuriAI 교수학습 서비스를 이용해 주시고 긍정적인 피드백을 남겨주셔서 진심으로 감사드립니다. 문의하신 '연령 설정 변경 및 재추출'의 경우, 현재 시스템 구조상 이미 생성이 완료된 계획안의 연령을 마이페이지에서 직접 변경하는 것은 어렵습니다. 유아 연령별 발문(교사 대사) 및 누리과정 연계 성취 기준 데이터가 다르게 파싱되기 때문인데요. 번거로우시겠지만 새로운 연령으로 '재생성'을 진행해 주셔야 하며, 잘못 생성된 계획안의 생성권 복구 조치를 위해 가입하신 계정 정보와 함께 고객센터로 메일 주시면 신속히 처리해 드리겠습니다. 감사합니다!",
            answeredAt: "2026-05-21"
        }
    }
];

interface MypageStore {
    inquries: Inquiry[];

    fetchtInquries: () => Promise<void>;
    addInquriy: (inquiry: InquiryForm) => Promise<void>;
    deleteInquiry: (id: number) => void;
    updateInquiry: (inquiry: Inquiry) => void;
};

export const useMypageStore = create<MypageStore>((set) => ({
    inquries: [],

    fetchtInquries: async () => {
        const url = API_ROUTES.INQUIRY.BASE;

        try {
            const response = await apiFetch(url);
            if (!response.ok) throw new Error("사용자 문의글 조회 실패");
            const inquiriesData = await response.json();

            set({ inquries: Array.isArray(inquiriesData) ? inquiriesData : [] });
        } catch (err) {
            console.error(`fetchInquires 실패: ${err}`);
        }
    },
    addInquriy: async(inquiry) => {

        try {
            const response = await apiFetch(`${API_ROUTES.INQUIRY.BASE}`, {
                method: "POST",
                body: JSON.stringify(inquiry)
            });

            if (!response.ok) throw new Error("문의글 작성 실패");
            const insertInquiry = await response.json();

            set(state => ({
                inquries: [insertInquiry, ...state.inquries],
            }))
        } catch (err) {
            console.error(`addInquiry 실패: ${err}`);
        }
    },
    deleteInquiry: id => set(state => ({ inquries: state.inquries.filter(q => q.id !== id) })),
    updateInquiry: inquiry => set(state => ({
        inquries: state.inquries.map(item => item.id === inquiry.id ? { ...inquiry, updatedAt: new Date().toISOString() } : item)
    })),
}));