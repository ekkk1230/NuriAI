"use client";

import { useFindForm } from "@/hook/useFindForm"
import { useForm } from "@/hook/useForm";
import { useUiStore } from "@/store/useUiStore";
import TextModal from "../Modal/modalContents/TextModal";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FindForm({ findType }: { findType: string}) {
    const { findIdApi, findPwdApi } = useFindForm();
    const { openModal, closeModal } = useUiStore();
    const router = useRouter();
    
    const initialState = findType === "id"
        ? { email: "" }
        : { userId: "", email: "" };

    const { form, handleChange } = useForm(initialState);

    const handleClick = async () => {
        if (findType === "id") {
            if (!form.email) {
                openModal("확인", "CHECK", <TextModal txt="이메일을 입력해주세요." onConfirm={closeModal} />);
                return;
            }

            const foundId = await findIdApi(form.email);

            openModal(
                "아이디 찾기 결과",
                "CHECK",
                <TextModal 
                    txt="찾으신 아이디는" 
                    highlight={foundId} 
                    onConfirm={() => {
                        closeModal();
                        router.push("/welcome/login");
                    }}
                />
            );
        } else {
            const userId = (form as any).userId;
            const email = (form as any).email;
    
            if (!userId) {
                openModal("확인", "CHECK", <TextModal txt="아이디를 입력해주세요." onConfirm={closeModal} />);
                return;
            }

            if (!email) {
                openModal("확인", "CHECK", <TextModal txt="이메일을 입력해주세요." onConfirm={closeModal} />);
                return;
            }
    
            await findPwdApi(userId, email);
        }
    };

    return (
        <form>
            <p className="text-[2.4rem] font-bold mb-[2rem]">{findType === "id" ? "아이디 찾기" : "비밀번호 찾기"}</p>
            {
                findType === "id" 
                ? (
                    <label className="block">
                        <p className="text-[1.6rem] font-semibold mb-[1.2rem]">이메일</p>
                        <input type="text" name="email" value={form.email || ""} onChange={handleChange} />
                    </label>
                ) 
                : (
                    <>
                        <label className="block">
                            <p className="text-[1.6rem] font-semibold mb-[1.2rem]">아이디</p>
                            <input type="text" name="userId" value={form.userId || ""} onChange={handleChange} />
                        </label>
                        <label className="block mt-[2rem]">
                            <p className="text-[1.6rem] font-semibold mb-[1.2rem]">이메일</p>
                            <input type="text" name="email" value={form.email || ""} onChange={handleChange} />
                        </label>
                    </>
                )
            }
            <button 
                type="button" 
                className="bg-main-gradient mt-[2rem] rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]"
                onClick={handleClick}
            >
                {findType === "id" ? "아이디 찾기" : "비밀번호 찾기"}
            </button>

            <Link href="/welcome/login" className="block mt-[2rem] text-[1.4rem] text-center text-textMuted !underline underline-offset-3">로그인 하러 가기</Link>
        </form>
    )
}
