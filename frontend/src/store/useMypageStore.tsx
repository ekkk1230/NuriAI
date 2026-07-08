import { API_ROUTES } from "@/constants/api";
import { AnswerForm, Inquiry, InquiryForm, recentViewPlan } from "@/type/Mypage";
import { apiFetch } from "@/util/api";
import { create } from "zustand";

interface MypageStore {
    inquries: Inquiry[];

    fetchtAllInquiries: () => Promise<void>;
    fetchtUserInquiries: () => Promise<void>;
    addInquriy: (inquiry: InquiryForm) => Promise<void>;
    deleteInquiry: (inquiryId: number) => Promise<void>;
    updateInquiry: (updateInquiry: Inquiry) => Promise<void>;

    insertAnswer: (id: number,answer: AnswerForm) => Promise<void>;
    updateAnswer: (id: number, updatedAnswer: AnswerForm) => Promise<void>;
    deleteAnswer: (inquiryId: number) => Promise<void>;

    recentViewPlans: recentViewPlan[];
    fetchRecentViewPlans: () => Promise<void>;
};

export const useMypageStore = create<MypageStore>((set) => ({
    inquries: [],

    fetchtAllInquiries: async () => {
        const url = API_ROUTES.INQUIRY.BASE;

        try {
            const response = await apiFetch(`${url}/all`);
            if (!response.ok) throw new Error("전체 문의글 조회 실패");
            const allInquiriesData = await response.json();

            set({ inquries: Array.isArray(allInquiriesData) ? allInquiriesData : [] });
        } catch (err) {
            console.error(`fetchAllInquiries 실패: ${err}`);
        }
    },
    fetchtUserInquiries: async () => {
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
    deleteInquiry: async(inquiryId) => {
        try {
            const response = await apiFetch(`${API_ROUTES.INQUIRY.DELETE(inquiryId)}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("문의글 삭제 실패");

            set(state => ({
                inquries: state.inquries.filter(i => i.id !== inquiryId)
            }));
        } catch (err) {
            console.error(`deleteInquiry 실패: ${err}`);
        }
    },
    updateInquiry: async(updateInquiry) => {
        const inquiryId = updateInquiry.id!;
        const url = API_ROUTES.INQUIRY.UPDATE(inquiryId);
        try {
            const response = await apiFetch(`${url}`, {
                method: "POST",
                body: JSON.stringify(updateInquiry)
            });

            if (!response.ok) throw new Error("문의글 수정 실패");
            const updateInquiryData = await response.json();

            set(state => ({
                inquries: state.inquries.map(i => i.id === inquiryId ? updateInquiryData : i)
            }));
        } catch (err) {
            console.error(`updateInquiry 실패; ${err}`);
        };
    },
    insertAnswer: async(id, answer) => {
        // console.log(answer)
        try {
            const response = await apiFetch(`${API_ROUTES.INQUIRY.INSERT_ANSWER(id)}`, {
                method: "POST",
                body: JSON.stringify(answer)
            });

            if (!response.ok) throw new Error("문의글 답변 등록 실패");
            const insertAnswerData = await response.json();

            set(state => ({
                inquries: state.inquries.map(i => 
                    i.id === id
                    ? {
                        ...i,
                        status: "ANSWERED",
                        answer: insertAnswerData
                    }
                    : i
                )
            }))
        } catch (err) {
            console.error(`insertAnswer 실패: ${err}`);
        }
    },
    updateAnswer: async(id, updatedAnswer) => {
        try {
            const response = await apiFetch(`${API_ROUTES.INQUIRY.UPDATE_ANSWER(id)}`, {
                method: "PUT",
                body: JSON.stringify(updatedAnswer)
            });

            if (!response.ok) throw new Error("문의글 답변 등록 실패");
            const updateAnswerData = await response.json();

            set(state => ({
                inquries: state.inquries.map(i => 
                    i.id === id
                    ? {
                        ...i,
                        status: "ANSWERED",
                        answer: updateAnswerData
                    }
                    : i
                )
            }))
        } catch (err) {
            console.error(`updateAnswer 실패: ${err}`);
        }
    },
    deleteAnswer: async(inquiryId) => {
        try {
            const response = await apiFetch(`${API_ROUTES.INQUIRY.DELETE_ANSWER(inquiryId)}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("문의글 답변 삭제 실패");

            set(state => ({ inquries: state.inquries.map(i => 
                i.id === inquiryId
                ? {
                    ...i,
                    status: "PENDING",
                    answer: undefined
                }
                : i
            )}));
        } catch (err) {
            console.error(`deleteAnswer 실패: ${err}`);
        }
    },
    recentViewPlans: [],
    fetchRecentViewPlans: async () => {
        try{
            const response = await apiFetch(`${API_ROUTES.RECENT_VIEW.BASE}`);
            if (!response.ok) throw new Error("최근 조회한 계획안 조회 실패");
            const recentViewPlansData = await response.json();
            set({ recentViewPlans: Array.isArray(recentViewPlansData) ? recentViewPlansData : [] });
        } catch (err) {
            console.error(`fetchRecentViewPlans 실패: ${err}`);
        }
    }
}));