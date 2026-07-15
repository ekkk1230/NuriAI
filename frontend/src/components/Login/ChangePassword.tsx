import { useForm } from "@/hook/useForm";
import { useUiStore } from "@/store/useUiStore";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { useRef, useState } from "react";

export const ChangePassword = () => {
    const { form, handleChange } = useForm({ password: "", confirm: "" });
    const { changePwd } = useWelcomeStore();
    const { closeModal } = useUiStore();
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSave = async() => {
        setError("");
        if (form.password !== form.confirm) {
            setError("비밀번호가 일치하지 않습니다.");
            passwordRef.current?.focus();
            return;
        };

        const result = await changePwd(form.password);

        if (result) {
            setIsSuccess(true);
        } else {
            setError("비밀번호 변경에 실패했습니다.")
        }
    };

    if (isSuccess) {
        return (
            <div className="p-[4rem_2rem] text-center">
                <p className="text-[1.6rem] font-bold mb-[2rem]">비밀번호가 성공적으로 변경되었습니다.</p>
                <button 
                    onClick={closeModal} 
                    className="block rounded-[.8rem] text-center text-textLight bg-mainLight p-[1.2rem_1rem] w-full font-semibold text-[1.4rem]"
                >
                    확인
                </button>
            </div>
        )
    }
    


    return (
        <div className="p-[4rem_2rem]">
            {error && <p className="text-red-500 text-[1.4rem] mb-[1rem] text-center">{error}</p>}
            <input ref={passwordRef} type="password" name="password" value={form.password} onChange={handleChange} placeholder="새로운 비밀번호를 입력하세요." />
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} className="mt-[1rem] block" placeholder="새로운 비밀번호를 다시 입력하세요." />
            <button onClick={handleSave} className="block mt-[2rem] rounded-[.8rem] text-center text-textLight bg-mainLight p-[1.2rem_1rem] w-full font-semibold text-[1.4rem]">확인</button>
        </div>
    )
}