"use client";

import { AGE_OPTIONS } from "@/constants/activityOptions"
import Link from "next/link"
import { useForm } from "@/hook/useForm";
import { UserRegisterForm } from "@/type/User";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { useUiStore } from "@/store/useUiStore";
import TextModal from "@/components/Modal/modalContents/TextModal";
import React, { useRef, useState } from "react";
import DuplicateModal from "@/components/Modal/modalContents/DuplicateModal";
import { useRouter } from "next/navigation";

const initialUserValues: UserRegisterForm = {
    userId: "",
    userNickname: "",
    userEmail: "",
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
    const userEmailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPwdRef = useRef<HTMLInputElement>(null);

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isEmailChecked, setIsEmailChecked] = useState(false);

    const handleJoin = async () => {
        // 1. 빈 항목 체크
        if (!userForm.userId) return showValidationError("아이디를 입력해주세요.", userIdRef);
        if (!userForm.userNickname) return showValidationError("닉네임을 입력해주세요.", userNicknameRef);
        if (!userForm.userEmail) return showValidationError("이메일을 입력해주세요.", userEmailRef);
        if (!userForm.userPwd) return showValidationError("비밀번호를 입력해주세요.", passwordRef);
        if (!userForm.userConfirmPwd) return showValidationError("비밀번호 확인을 입력해주세요.", confirmPwdRef);

        // 2. 중복 확인 체크
        if (!isIdChecked) return showValidationError("아이디 중복확인을 해주세요.", userIdRef);
        if (!isNicknameChecked) return showValidationError("닉네임 중복확인을 해주세요.", userNicknameRef);
        if (!isEmailChecked) return showValidationError("이메일 중복확인을 해주세요.", userEmailRef);

        // 3. 비밀번호 오류
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
                "CHECK",
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

    const showValidationError = (message: string, ref: { current: HTMLInputElement | null }) => {
        openModal(
            "오류",
            "CHECK",
            <TextModal
                txt={message}
                onConfirm={() => {
                    closeModal();
                    ref.current?.focus();
                }}
            />
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        if (e.target.name === "userId") setIsIdChecked(false);
        if (e.target.name === "userNickname") setIsNicknameChecked(false);
        if (e.target.name === "userEmail") setIsEmailChecked(false);
    }

    const handleDuplication = async(type: "userId" | "userNickname" | "userEmail") => {
        const tgText = type === "userId" 
                    ? "아이디" 
                    : (type === "userNickname" ? "닉네임" : "이메일");
        const ref = type === "userId" 
                    ? userIdRef 
                    : (type === "userNickname" ? userNicknameRef : userEmailRef);
        const value = userForm[type];

        if (!value.trim()) {
            openModal(
                "오류",
                "CHECK",
                <TextModal 
                    txt={`${tgText}을(를) 입력해주세요.`}
                    onConfirm={() => {
                        closeModal();
                        if (ref.current) {
                            ref.current.focus();
                        }
                    }} 
                />
            )
        };

        try {
            const result = await confirmData(type, value);

            if (!result.isDuplicated) {
                type === "userId" 
                    ? setIsIdChecked(true) 
                    : (type === "userNickname" ? setIsNicknameChecked(true) : setIsEmailChecked(true));
            }

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
                    <input type="text" ref={userIdRef} onChange={handleInputChange} value={userForm.userId} name="userId" />
                    <button type="button" onClick={() => handleDuplication("userId")} className="rounded-[.8rem] p-[1rem_1.4rem] bg-[#f7ecfe] text-main font-semibold text-[1.4rem] whitespace-nowrap">중복확인</button>
                </div>
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">닉네임</p>
                <div className="flex gap-[.8rem]">
                    <input type="text" ref={userNicknameRef} onChange={handleInputChange} value={userForm.userNickname} name="userNickname" />
                    <button type="button" onClick={() => handleDuplication("userNickname")} className="rounded-[.8rem] p-[1rem_1.4rem] bg-[#f7ecfe] text-main font-semibold text-[1.4rem] whitespace-nowrap">중복확인</button>
                </div>
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">이메일</p>
                <div className="flex gap-[.8rem]">
                    <input type="text" ref={userEmailRef} onChange={handleInputChange} value={userForm.userEmail} name="userEmail" />
                    <button type="button" onClick={() => handleDuplication("userEmail")} className="rounded-[.8rem] p-[1rem_1.4rem] bg-[#f7ecfe] text-main font-semibold text-[1.4rem] whitespace-nowrap">중복확인</button>
                </div>
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호</p>
                <input type="password" ref={passwordRef} onChange={handleInputChange} value={userForm.userPwd} name="userPwd" />
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호 확인</p>
                <input type="password" ref={confirmPwdRef} onChange={handleInputChange} value={userForm.userConfirmPwd} name="userConfirmPwd" />
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