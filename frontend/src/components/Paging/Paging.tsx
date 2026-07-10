import { usePlanStore } from "@/store/usePlanStore"

export const Paging = ({ totalPages, currentPage, onPageChange }: { 
    totalPages: number, 
    currentPage: number, 
    onPageChange: (page: number) => void 
}) => {
    return (
        <div className="flex justify-center items-center gap-[0.5rem] my-[4rem]">
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-[1.4rem] py-[0.8rem] rounded-[0.8rem] text-[1.4rem] font-semibold text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
                // 현재 페이지 기준 앞뒤로 2개씩만 표시 (총 5개)
                if (i < currentPage - 2 || i > currentPage + 2) return null;
                
                return (
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`w-[3.6rem] h-[3.6rem] rounded-[0.8rem] text-[1.4rem] font-bold transition-all duration-200
                            ${currentPage === i 
                                ? 'bg-main text-white shadow-sm scale-105' 
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        {i + 1}
                    </button>
                );
            })}

            <button
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-[1.4rem] py-[0.8rem] rounded-[0.8rem] text-[1.4rem] font-semibold text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                다음
            </button>
        </div>
    )
}