import { useForm } from "@/hook/useForm";
import { useWelcomeStore } from "@/store/useWelcomeStore";
import { useRef, useState } from "react"

export const VerifyPassword = ({ setStep }: { setStep: (step: 'verify' | 'change') => void }) => {
    const { form, handleChange, resetForm } = useForm({ password: "" });
    const { checkUserPwd } = useWelcomeStore();
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleVerify = async () => {
        const result = await checkUserPwd(form.password);

        // console.log(result)

        if (result) {
            setError("");
            setStep('change');
        } else {
            setError("비밀번호를 다시 입력해주세요.");
            resetForm();
            inputRef.current?.focus();
        }
    }

    return(
        <div className="p-[4rem_2rem]">
            <p className="text-[1.4rem] font-semibold mb-[1rem]">기존 비밀번호를 입력해주세요.</p>
            {error && <p className="text-red-500 text-[1.4rem] mb-[1rem] text-center">{error}</p>}
            <input ref={inputRef} type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요." />
            <button onClick={handleVerify} className="block mt-[2rem] rounded-[.8rem] text-center text-textLight bg-mainLight p-[1.2rem_1rem] w-full font-semibold text-[1.4rem]">확인</button>
        </div>
    )
}