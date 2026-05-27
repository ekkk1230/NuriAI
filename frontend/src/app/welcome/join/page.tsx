"use client";

import { useState } from "react";
import { AGE_OPTIONS } from "@/constants/activityOptions"
import Link from "next/link"
import { useForm } from "@/hook/useForm";

const initialUserValues: User = {
    userId: "",
    userNickname: "",
    userPwd: "",
    userConfirmPwd: "",
    userClassAge: null,
};

function page() {
    const { form: userForm, setForm, handleChange, resetForm } = useForm<User>(initialUserValues);

    return (
        <form>
            <p className="text-[2.4rem] font-bold mb-[2rem]">회원가입</p>

            <label className="block">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">아이디</p>
                <input type="text" onChange={handleChange} value={userForm.userId} name="userId" />
            </label>

            <label className="block">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">닉네임</p>
                <input type="text" onChange={handleChange} value={userForm.userNickname} name="userNickname" />
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호</p>
                <input type="password" onChange={handleChange} value={userForm.userPwd} name="userPwd" />
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호 확인</p>
                <input type="password" onChange={handleChange} value={userForm.userConfirmPwd} name="userConfirmPwd" />
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
                <button onClick={resetForm} className="bg-[#777] rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]">취소</button>
                <button className="bg-blueActive rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]">회원가입</button>
            </div>

            <p className="text-[1.6rem] text-textMuted mt-[1rem] text-center">이미 계정이 있으신가요? <Link href="/welcome/login" className="font-semibold !text-main">로그인</Link></p>
        </form>
    )
}

export default page