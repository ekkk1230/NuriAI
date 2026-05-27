import { useUiStore } from "@/store/useUiStore"

function ModalFooter({ confirmTxt = "확인", onConfirm }: {confirmTxt: string, onConfirm: () => void}) {
    const { modalType, closeModal } = useUiStore();

    const modalBtnBaseClass = "flex-1 rounded-[.8rem] p-[1.2rem_1.6rem] font-semibold text-[1.4rem] text-textLight"

    return (
        <div className="flex gap-[1rem] mt-[1.6rem] w-full">
            {
                modalType === "CHECK" ? (
                    <button onClick={closeModal} className={`${modalBtnBaseClass} bg-main`}>확인</button>
                ) : (
                    <>
                        <button onClick={closeModal} className={`${modalBtnBaseClass} bg-[#555]`}>취소</button>
                        <button onClick={onConfirm} className={`${modalBtnBaseClass} bg-main`}>{confirmTxt}</button>
                    </>
                )
            }
        </div>
    )
}

export default ModalFooter