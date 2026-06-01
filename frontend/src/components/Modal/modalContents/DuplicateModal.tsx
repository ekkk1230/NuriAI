import ModalFooter from "../ModalFooter";

interface DuplicateModalProps {
    typeText: string;
    value: string;
    isDuplicated: boolean;
}

function DuplicateModal({ typeText, value, isDuplicated }: DuplicateModalProps) {
    return (
        <>
            <div className="text-[1.6rem] w-[30rem] text-center p-[2rem_2.4rem] flex flex-col gap-[0.8rem]">

                <p className="font-semibold text-main">"{value}"</p>
                
                {isDuplicated ? (
                    <p className="text-red-500 font-medium">
                        이미 존재하는 {typeText}입니다.
                    </p>
                ) : (
                    <p className="text-green-600 font-medium">
                        사용 가능한 {typeText}입니다.
                    </p>
                )}
            <ModalFooter />
            </div>
        </>
    )
}

export default DuplicateModal