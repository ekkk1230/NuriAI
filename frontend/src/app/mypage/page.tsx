"use client";

import { MdOutlineKeyboardArrowUp  } from "react-icons/md";
import { useMypage } from "@/hook/useMypage";
import { IoCloseCircle } from "react-icons/io5";
import { formatDate } from "@/util/format";
import { useUiStore } from "@/store/useUiStore";
import TextModal from "@/components/Modal/modalContents/TextModal";
import { useRouter } from "next/navigation";

function page() {
    const { 
        userPlans, 
        inquries, inquiryForm, 
        answerOpen, toggleInquiry,
        writeInQuiry, handleWrite,
        handleChange, onSubmitInquiry, handleDelete, 
        editingId, setEditingId, onClickEdit, handleUpdate,
        onSubmitAnswer,
        userCollectPlans
    } = useMypage();

    const { openModal, closeModal } = useUiStore();

    const route = useRouter();

    const useItemBoxClass = "rounded-[.8rem] p-[1.6rem_1rem] flex-1 text-center";
    const statusClass = "rounded-[60rem] p-[.8rem_1.2rem]";
    const isActiveStatus = "bg-[#eeffe6] text-[#309e8c]";
    const noActiveStatus = "bg-[#fffbf3] text-[#e28c0c]";

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
                            <p className="text-[3rem] mb-[2rem] font-bold text-[#8146b9]">{userPlans.length}</p>
                            <p className="text-[1.6rem] font-semibold text-textMuted">생성한 계획안</p>
                        </li>
                        <li className={`${useItemBoxClass} bg-[#def3ff]`}>
                            <p className="text-[3rem] mb-[2rem] font-bold text-[#375ea8]">{userCollectPlans.length}</p>
                            <p className="text-[1.6rem] font-semibold text-textMuted">보관함 저장</p>
                        </li>
                        {/* <li className={`${useItemBoxClass} bg-[#eeffe6]`}>
                            <p className="text-[3rem] mb-[2rem] font-bold text-[#309e8c]">{userPlans.length}</p>
                            <p className="text-[1.6rem] font-semibold text-textMuted">PDF 다운로드</p>
                        </li> */}
                    </ul>
                </div>

                <div className="bg-bgCard w-[60%] mx-auto p-[2rem] rounded-[1.2rem] shadow-sm relative">
                    <p className="text-[2rem] font-semibold mb-[1.2rem]">문의 게시판</p>

                    <button onClick={handleWrite} className="bg-main text-textLight text-[1.2rem] p-[.8rem_1rem] rounded-[.8rem] absolute right-[2rem] top-[2rem]">문의하기</button>

                    {writeInQuiry && (
                        <div className="bg-[#efefef] rounded-[.8rem] p-[5.2rem_1.6rem_2rem] my-[2rem] relative">
                            <button type="button" className="absolute right-[1rem] top-[1rem] text-[3.2rem]" onClick={handleWrite}><IoCloseCircle /></button>
                            <form onSubmit={onSubmitInquiry}>
                                <input type="text" onChange={handleChange} value={inquiryForm.title} name="title" placeholder="제목을 입력하세요." />
                                <textarea className="my-[1.2rem] p-[1.6rem]" name="inquiryContent" onChange={handleChange} value={inquiryForm.inquiryContent} placeholder="내용을 입력하세요."></textarea>

                                <button 
                                    disabled={!inquiryForm.title.trim() || !inquiryForm.inquiryContent.trim()}
                                    
                                    className="bg-main text-textLight text-[1.2rem] p-[.8rem_1rem] rounded-[.8rem] block ml-auto disabled:bg-[#c7adff]">등록</button>
                            </form>
                        </div>
                    )}

                    <ul className="mt-[2.8rem]">
                        {inquries.length >= 1 ? (
                            inquries.map(item => (
                                <li key={item.id} className="border-b border-solid border-[#eee] last:border-b-0 py-[1rem]">
                                    <button 
                                        onClick={() => toggleInquiry(item.id!)} 
                                        className="flex items-center text-[1.4rem] w-full gap-[1rem]"
                                    >
                                        <p className="mr-auto font-semibold">{item.title}</p>
                                        <p className="text-textMuted">{formatDate(item.createdAt!)}</p>
                                        <p className={`${statusClass} ${item.status === "ANSWERED" ? isActiveStatus : noActiveStatus}`}>
                                            {item.status === "ANSWERED" ? "답변완료" : "답변대기"}
                                        </p>
                                        <span className={`transition-transform duration-200 ${answerOpen[item.id!] ? "rotate-0" : "rotate-180"}`}>
                                            <MdOutlineKeyboardArrowUp />
                                        </span>
                                    </button>
                                    
                                    {answerOpen[item.id!] && (
                                        <>
                                            {answerOpen[item.id!] && (
                                            <>
                                                {editingId === item.id ? (
                                                    <form onSubmit={handleUpdate} className="bg-[#efefef] rounded-[.8rem] p-[1.6rem_1rem] my-[1rem]">
                                                        <input 
                                                            type="text" 
                                                            name="title" 
                                                            value={inquiryForm.title} 
                                                            onChange={handleChange} 
                                                            className="w-full p-[.8rem] rounded-[.4rem] mb-[1rem] border"
                                                            placeholder="수정할 제목"
                                                        />
                                                        <textarea 
                                                            name="inquiryContent" 
                                                            value={inquiryForm.inquiryContent} 
                                                            onChange={handleChange} 
                                                            className="w-full p-[1rem] rounded-[.4rem] h-[10rem] border"
                                                            placeholder="수정할 내용"
                                                        />
                                                        <div className="flex justify-end gap-[.8rem] mt-[1rem]">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setEditingId(null)}
                                                                className="text-[1.2rem] text-textMuted px-[1rem] py-[.6rem]"
                                                            >
                                                                취소
                                                            </button>
                                                            <button 
                                                                type="submit" 
                                                                className="bg-main text-textLight text-[1.2rem] p-[.6rem_1rem] rounded-[.8rem]"
                                                            >
                                                                저장
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className="rounded-[.8rem] my-[1rem] bg-[#f7f7f7] p-[1.6rem_1rem_1rem_1rem] text-[1.4rem] relative">
                                                            <div className="flex justify-between items-center mb-[.6rem]">
                                                                <p className="font-semibold text-[#555]">문의 내용</p>
                                                                
                                                                {item.status === "PENDING" && (
                                                                    <div className="flex gap-[.8rem] text-[1.4rem] text-textMuted font-medium">
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                onClickEdit(item);
                                                                            }} 
                                                                            className="hover:text-main transition-colors"
                                                                        >
                                                                            수정
                                                                        </button>
                                                                        <span className="text-[#ddd]">|</span>
                                                                        <button 
                                                                            className="hover:text-red-500 transition-colors"
                                                                            onClick={(e) => { 
                                                                                e.stopPropagation(); 
                                                                                openModal(
                                                                                    "문의글 삭제",
                                                                                    "CONFIRM",
                                                                                    <TextModal 
                                                                                        txt={"문의글을 삭제하시겠습니까?"}
                                                                                        onConfirm={async () => {
                                                                                            await handleDelete(item.id!); 
                                                                                            closeModal(); 
                                                                                            
                                                                                            openModal(
                                                                                                "알림",
                                                                                                "CHECK",
                                                                                                <TextModal 
                                                                                                    txt={"게시글이 성공적으로 삭제되었습니다."} 
                                                                                                    onConfirm={() => {
                                                                                                        closeModal();
                                                                                                        route.push("/mypage");
                                                                                                    }}
                                                                                                />
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                );
                                                                            }}
                                                                        >
                                                                            삭제
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-textDark leading-relaxed font-semibold text-[1.4rem]">{item.inquiryContent}</div>
                                                        </div>

                                                        {item.answer ? (
                                                            <div className="bg-[#ecdbff] text-textMuted p-[1rem_1rem_2rem] text-[1.4rem] rounded-[.8rem]">
                                                                <p className="text-main font-semibold">답변</p>
                                                                <div>{item.answer.answerContent}</div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                            <div className="bg-[#fffbf3] rounded-[.8rem] relative p-[1rem]">
                                                                <div 
                                                                    className="text-[#e28c0c] text-[1.4rem] font-semibold text-center">
                                                                    답변을 준비중 입니다. 잠시만 기다려 주세요.
                                                                </div>
                                                            </div>
                                                            <form onSubmit={onSubmitAnswer} className="border-[.1rem] border-dashed border-mainLight mt-[1rem] rounded-[.8rem] p-[1rem]">
                                                                <p className="text-mainLight font-semibold text-[1.4rem] mb-[1rem]">답변 입력</p>
                                                                <textarea name="answer-area" className="border-solid border-[#eee] p-[1rem] text-[1.4rem] leading-relaxed" placeholder="답변 내용을 입력하세요"></textarea>
                                                                <button className="block m-[1rem_0_0_auto] text-textLight bg-mainLight rounded-[.8rem] p-[1rem] text-[1.2rem] font-semibold hover:bg-[#820bd7]">답변 등록</button>
                                                            </form>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                        </>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p className="text-textMuted text-center text-[1.6rem] my-[2rem]">현재 작성된 문의글이 없습니다. 궁금하신 점을 문의해주세요.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default page