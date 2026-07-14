import { useState } from "react"

export const VerifyPassword = () => {
    const [password, setPassword] = useState("");

    return(
        <div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요." />
            <button>확인</button>
        </div>
    )
}