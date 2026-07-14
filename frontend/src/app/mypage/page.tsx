"use client";

import { useMypage } from "@/hook/useMypage";
import RelationChart from "@/components/Mypage/RelationChart";
import CategoryBarChart from "@/components/Mypage/CategoryBarChart";
import MyPlanList from "@/components/Mypage/MyPlanList";
import MyRecentViewList from "@/components/Mypage/MyRecentViewList";
import { ContentBox } from "@/components/Mypage/ContentBox";
import InquiryWrap from "@/components/Mypage/InquiryWrap";
import { useUiStore } from "@/store/useUiStore";
import TextModal from "@/components/Modal/modalContents/TextModal";
import { ChangePasswordModal } from "@/components/Modal/modalContents/ChangePasswordModal";

function page() {
    const { userPlans, inquries, userCollectPlans, recentStatistics, withdraw } = useMypage();
    const { openModal, closeModal } = useUiStore();

    const useItemBoxClass = "rounded-[.8rem] p-[1.6rem_1rem] flex-1 text-center";

    const completedCount = inquries.filter(q => q.answer != null).length;

    const handleChangPwd = () => {
        openModal(
            "비밀번호 변경",
            "CHECK",
            <ChangePasswordModal />
        )
    }

    const handleWithdraw = () => {
        openModal(
            "회원 탈퇴",
            "CONFIRM",
            <TextModal 
                txt="회원 탈퇴를 진행하시겠습니까?"
                onConfirm={async () => {
                    closeModal();
                    await withdraw();
                }}
            />
        )
    };

    return (
        <div className="bg-bgCard flex flex-col h-[100%]">
            <div className="border-b-[.1rem] border-solid border-[#eee] p-[2.6rem]">
                <p className="text-[2.8rem] font-bold mb-[1rem]">마이페이지</p>
                <p className="text-[1.8rem] font-semibold text-textMuted">NuriAI 이용 정보를 확인할 수 있습니다.</p>
            </div>
            
            <div className="bg-bgPreview flex-1 pt-[4rem]">
                <div className="w-[80%] mx-auto">
                    <ContentBox title="이용 현황">
                        <ul className="flex gap-[1.2rem]">
                            <li className={`${useItemBoxClass} bg-[#f0deff]`}>
                                <p className="text-[3rem] mb-[2rem] font-bold text-[#8146b9]">{userPlans.length}</p>
                                <p className="text-[1.6rem] font-semibold text-textMuted">생성한 계획안</p>
                            </li>
                            <li className={`${useItemBoxClass} bg-[#def3ff]`}>
                                <p className="text-[3rem] mb-[2rem] font-bold text-[#375ea8]">{userCollectPlans.length}</p>
                                <p className="text-[1.6rem] font-semibold text-textMuted">보관함 저장</p>
                            </li>
                            <li className={`${useItemBoxClass} bg-[#eeffe6]`}>
                                <p className="text-[3rem] mb-[2rem] font-bold text-[#309e8c]">{completedCount} / {inquries.length}</p>
                                <p className="text-[1.6rem] font-semibold text-textMuted">답변 완료 / 전체 문의</p>
                            </li>
                            {/* <li className={`${useItemBoxClass} bg-[#eeffe6]`}>
                                <p className="text-[3rem] mb-[2rem] font-bold text-[#309e8c]">{userPlans.length}</p>
                                <p className="text-[1.6rem] font-semibold text-textMuted">PDF 다운로드</p>
                            </li> */}
                        </ul>
                    </ContentBox>

                    <div className="h-[40rem] grid gap-[2rem] mx-auto grid-cols-[2fr_1.5fr]">
                        <RelationChart recentStatistics={recentStatistics} />
                        <CategoryBarChart userPlans={userPlans} />
                    </div>

                    <div className="grid gap-[2rem] mx-auto grid-cols-2">
                        <MyPlanList />
                        <MyRecentViewList />
                    </div>

                    <InquiryWrap />

                    <div className="flex gap-[.8rem] justify-end items-center mb-[4rem]">
                        <button onClick={handleChangPwd} className="text-[1.4rem] w-[12rem] bg-mainLight text-textLight font-semibold rounded-2xl p-[1.2rem_2rem] block">비밀번호 변경</button>
                        <button onClick={handleWithdraw} className="text-[1.4rem] w-[12rem] bg-red-800 text-textLight font-semibold rounded-2xl p-[1.2rem_2rem] block">회원 탈퇴</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page