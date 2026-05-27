import Link from "next/link"

function page() {
    return (
        <form>
            <p className="text-[2.4rem] font-bold mb-[2rem]">로그인</p>

            <label className="block">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">아이디</p>
                <input type="text" name="userId" />
            </label>

            <label className="block mt-[2rem]">
                <p className="text-[1.6rem] font-semibold mb-[1.2rem]">비밀번호</p>
                <input type="password" name="userPwd" />
            </label>

            <button className="bg-main-gradient mt-[2rem] rounded-[.8rem] p-[1rem] w-full block text-textLight font-semibold text-[1.8rem]">로그인</button>

            <p className="text-[1.6rem] text-textMuted mt-[1rem] text-center">아직 계정이 없으신가요? <Link href="/welcome/join" className="font-semibold !text-main">회원가입</Link></p>
        </form>
    )
}

export default page