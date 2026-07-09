import { usePlanStore } from "@/store/usePlanStore"

export const Paging = ({ totalPages, currentPage, onPageChange }: { 
    totalPages: number, 
    currentPage: number, 
    onPageChange: (page: number) => void 
}) => {
    return (
        <div className="flex justify-center items-center gap-[1rem] my-[4rem]">
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-[1.2rem] text-[1.4rem] py-[.6rem] border rounded-[.8rem] font-semibold"
            >
                이전
            </button>

            {/* 페이지 번호 리스트 */}
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                   onClick={() => onPageChange(i)}
                    className={`w-[3.5rem] h-[3.5rem] rounded-[.8rem] text-[1.4rem] font-bold transition-all 
                        ${currentPage === i 
                            ? 'bg-main text-white shadow-md' 
                            : 'bg-white border border-[#eee] text-gray-500 hover:bg-gray-200'}`}
                >
                    {i + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-[1.2rem] text-[1.4rem] py-[.6rem] border bg-bgCard rounded-[.8rem] font-semibold"
            >
                다음
            </button>
        </div>
    )
}