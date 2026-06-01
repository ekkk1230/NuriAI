"use client";

import TextModal from "@/components/Modal/modalContents/TextModal";
import { useForm } from "@/hook/useForm";
import { useUiStore } from "@/store/useUiStore";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { LoginUserForm } from "@/type/User";
import Link from "next/link"
import { useRouter } from "next/navigation"

const initialLoginValue: LoginUserForm = {
    userId : "",
    userPwd : "",
}

function page() {
    const router = useRouter();
    const { loginUser } = useWelcomeStore();
    const { openModal } = useUiStore();
    const { form: loginForm, handleChange } = useForm<LoginUserForm>(initialLoginValue);


    const handleLogin = async () => {
        const user = {
            userId: loginForm.userId,
            userPwd: loginForm.userPwd
        };

        try {
            await loginUser(user);
            router.push("/");
        } catch (err) {
            openModal(
                "로그인 실패",
                "CHECK",
                <TextModal txt="아이디 또는 비밀번호를 확인해주세요" />
            )
            console.error(err);
        }
    };

    return (
        <form>
            <p className="text-[2.4rem] font-bold mb-[2rem]">로그인</p>

            <label className="block">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">아이디</p>
                <input type="text" name="userId" value={loginForm.userId} onChange={handleChange} />
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호</p>
                <input type="password" name="userPwd" value={loginForm.userPwd} onChange={handleChange} />
            </label>

            <button type="button" onClick={handleLogin} className="bg-main-gradient mt-[2rem] rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]">로그인</button>

            <p className="text-[1.6rem] text-textMuted mt-[1rem] text-center">아직 계정이 없으신가요? <Link href="/welcome/join" className="font-semibold !text-main">회원가입</Link></p>
        </form>
    )
}

export default page