"use client";

import { AGE_OPTIONS } from "@/constants/activityOptions"
import Link from "next/link"
import { useForm } from "@/hook/useForm";
import { UserRegisterForm } from "@/type/User";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { useUiStore } from "@/store/useUiStore";
import TextModal from "@/components/Modal/modalContents/TextModal";
import { useRef } from "react";
import DuplicateModal from "@/components/Modal/modalContents/DuplicateModal";
import { useRouter } from "next/navigation";

const initialUserValues: UserRegisterForm = {
    userId: "",
    userNickname: "",
    userPwd: "",
    userConfirmPwd: "",
    userClassAge: null,
};

function page() {
    const router = useRouter();
    const { openModal, closeModal } = useUiStore();
    const { joinUser, confirmData } = useWelcomeStore();
    const { form: userForm, setForm, handleChange, resetForm } = useForm<UserRegisterForm>(initialUserValues);

    const userIdRef = useRef<HTMLInputElement>(null);
    const userNicknameRef = useRef<HTMLInputElement>(null);
    const confirmPwdRef = useRef<HTMLInputElement>(null);

    const handleJoin = async () => {
        if (userForm.userPwd !== userForm.userConfirmPwd) {
            openModal(
                "비밀번호 오류",
                "CHECK",
                <TextModal 
                    txt={"비밀번호를 잘못 입력했습니다."} 
                    onConfirm={() => {
                        closeModal();
                        confirmPwdRef.current?.focus();
                    }} 
                />
            )
            return;
        };
        
        const { userConfirmPwd, ...serverData } = userForm;

        try {
            await joinUser(serverData);

            openModal(
                "가입완료",
                "CONFIRM",
                <TextModal 
                    txt={"회원가입이 정상적으로 완료되었습니다!"} 
                    onConfirm={() => {
                        closeModal();
                        router.push("/welcome/login"); 
                    }} 
                />
            )
        } catch (err) {
            openModal("오류", "CHECK", <TextModal txt={"회원가입 처리 중 오류가 발생했습니다."} />);
        }

    };

    const handleDuplication = async(type: "userId" | "userNickname") => {
        const tgText = type === "userId" ? "아이디" : "닉네임"
        const ref = type === "userId" ? userIdRef : userNicknameRef;
        const value = userForm[type];

        if (!value.trim()) {
            openModal(
                "오류",
                "CHECK",
                <TextModal 
                    txt={`${tgText}을(를) 입력해주세요.`}
                    onConfirm={() => {
                        closeModal();
                        ref.current?.focus();
                    }} 
                />
            )
        };

        try {
            const result = await confirmData(type, value);

            openModal(
                `${tgText} 확인 결과`,
                "CHECK",
                <DuplicateModal
                    typeText={result.typeText}
                    value={result.value}
                    isDuplicated={result.isDuplicated}
                />
            )
        } catch (err) {
            openModal("오류", "CONFIRM", <TextModal txt={"중복 확인 중 오류가 발생했습니다"} />);
        }
    };

    return (
        <form>
            <p className="text-[2.4rem] font-bold mb-[2rem]">회원가입</p>

            <label className="block">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">아이디</p>
                <div className="flex gap-[.8rem]">
                    <input type="text" ref={userIdRef} onChange={handleChange} value={userForm.userId} name="userId" />
                    <button type="button" onClick={() => handleDuplication("userId")} className="rounded-[.8rem] p-[1rem_1.4rem] bg-[#f7ecfe] text-main font-semibold text-[1.4rem] whitespace-nowrap">중복확인</button>
                </div>
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">닉네임</p>
                <div className="flex gap-[.8rem]">
                    <input type="text" ref={userNicknameRef} onChange={handleChange} value={userForm.userNickname} name="userNickname" />
                    <button type="button" onClick={() => handleDuplication("userNickname")} className="rounded-[.8rem] p-[1rem_1.4rem] bg-[#f7ecfe] text-main font-semibold text-[1.4rem] whitespace-nowrap">중복확인</button>
                </div>
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호</p>
                <input type="password" onChange={handleChange} value={userForm.userPwd} name="userPwd" />
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호 확인</p>
                <input type="password" ref={confirmPwdRef} onChange={handleChange} value={userForm.userConfirmPwd} name="userConfirmPwd" />
            </label>

            <div className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">담당 연령(선택)</p>
                <div className="flex gap-[1rem]">
                    {AGE_OPTIONS.map(op => 
                        <button 
                            key={op.value} value={op.value} type="button"
                            onClick={() => setForm(prev => ({ ...prev, userClassAge: op.value }))}
                            className={`border border-solid p-[0.8rem_1.6rem] rounded-[0.6rem] transition-all ${
                                userForm.userClassAge === op.value 
                                    ? 'bg-main text-white border-main' 
                                    : 'border-[#ddd] bg-white text-black hover:bg-main hover:text-white'
                            }`}
                        >{op.label}</button>
                    )}
                </div>
            </div>

            <div className="my-[2rem] flex gap-[1rem]">
                <button type="button" onClick={resetForm} className="bg-[#777] rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]">취소</button>
                <button type="button" onClick={handleJoin} className="bg-blueActive rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]">회원가입</button>
            </div>

            <p className="text-[1.6rem] text-textMuted mt-[1rem] text-center">이미 계정이 있으신가요? <Link href="/welcome/login" className="font-semibold !text-main">로그인</Link></p>
        </form>
    )
}

export default page