import { useUiStore } from '@/store/useUiStore'
import { IoMdClose } from "react-icons/io";

function ModalLayout() {
    const { modalTitle, modalContent, closeModal } = useUiStore();
    
    return (
        <div className="bg-[rgba(0,0,0,.8)] z-20 fixed top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="bg-bgCard rounded-[1.2rem] w-auto">
                <div className="text-textLight rounded-[1.2rem_1.2rem_0_0] bg-sub2-gradient flex items-center justify-between">
                    <div className="ttext-[2rem] font-bold">{modalTitle}</div>
                    <button onClick={closeModal}><IoMdClose /></button>
                </div>
                
                {modalContent}
            </div>
        </div>
    )
}

export default ModalLayout