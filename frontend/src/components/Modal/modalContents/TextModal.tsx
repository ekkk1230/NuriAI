import ModalFooter from "../ModalFooter"

interface TextModalProps {
    txt: string,
    highlight?: string;
    onConfirm?: () => void;
}

function TextModal({ txt, highlight, onConfirm }: TextModalProps) {
    return (
        <div className="p-[3.2rem_2rem] w-[50rem]">
            <div className="text-[1.8rem] text-center mb-[4rem]">
                {txt}
                {highlight && <span className="font-bold text-mainLight"> {highlight}</span>}
                {highlight && "입니다."}
            </div>
            <ModalFooter onConfirm={onConfirm} />
        </div>
    )
}

export default TextModal