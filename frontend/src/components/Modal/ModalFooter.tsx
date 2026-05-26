import { useUiStore } from "@/store/useUiStore"

function ModalFooter() {
    const { modalType } = useUiStore();

    const modalBtnBaseClass = "rounded-[.8rem] p-[1.2rem_1.6rem] font-semibold text-[1.4rem]"

    return (
        <div className="flex gap-[1rem] mt-[1.6rem]">
            {
                modalType === "CHECK" ? (
                    <button className={`${modalBtnBaseClass}`}>확인</button>
                ) : (
                    <>
                        <button className={`${modalBtnBaseClass}`}>취소</button>
                        <button className={`${modalBtnBaseClass}`}>확인</button>
                    </>
                )
            }
        </div>
    )
}

export default ModalFooter