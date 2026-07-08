function NoPlan({ txt, showButton, router }: { txt?: string; showButton?: boolean, router?: any }) {
    return (
        <>
            <div className="w-[10rem] h-auto opacity-50 block m-[10%_auto_6rem]">
                <img src="/document.png" alt="" className="" />
            </div>
            <p className="text-[1.6rem] text-textMuted text-center font-semibold">
                {txt || "왼쪽에서 주제와 영역을 선택하고 계획안을 생성해보세요!"}
                {showButton && (
                    <button className="btn-base mt-[4rem] block rounded-[60rem] bg-main-gradient text-textLight px-16 py-8 text-[1.6rem]" onClick={() => router.push('/workspace')}>
                        계획안 생성하기
                    </button>
                )}
            </p>
        </>
    )
}

export default NoPlan