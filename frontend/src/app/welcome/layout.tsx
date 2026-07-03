export default function WelcomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-login-gradient w-full min-h-screen">
            <div className="pt-[10rem] pb-[4rem]">
                <img src="/logo.png" alt="" className="block w-[26rem] mx-auto" />
                <p className="text-center text-[2.4rem] font-semibold my-[2rem_4.2rem]">AI 누리과정 조력자</p>

                <div className="bg-bgCard rounded-[1.2rem] shadow-sm w-[25%] min-w-[60rem] mx-[auto] p-[4rem_3.2rem] relative before:content-[''] before:w-full before:h-[.8rem] before:rounded-[1.2rem_1.2rem_0_0] before:bg-main-gradient before:top-0 before:left-0 before:absolute">
                    {children}
                </div>
            </div>
        </div>
    )
}