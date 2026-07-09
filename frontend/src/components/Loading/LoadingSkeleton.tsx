export const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4 p-[1.4rem_1.2rem]">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center w-full">
                <div className="w-[5rem] h-[5rem] bg-gray-100 rounded-[1.2rem] mr-[1.6rem]" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-[60%] bg-gray-100 rounded" />
                    <div className="h-3 w-[40%] bg-gray-100 rounded" />
                </div>
            </div>
        ))}
    </div>
);