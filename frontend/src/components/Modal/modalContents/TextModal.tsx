import ModalFooter from "../ModalFooter"

interface TextModalProps {
    txt: string,
    onConfirm?: () => void;
}

function TextModal({ txt, onConfirm }: TextModalProps) {
    return (
        <div className="p-[3.2rem_2rem] w-[50rem]">
            <div className="text-[1.8rem] text-center mb-[4rem]">{txt}</div>
            <ModalFooter onConfirm={onConfirm} />
        </div>
    )
}

export default TextModal