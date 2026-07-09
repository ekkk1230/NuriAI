export default function LoadingFetchPlans({ type }: { type: string }) {

    const PlansItemBox = () => <div className="relative bg-bgCard rounded-[.8rem] hover:-top-[.5rem] shadow-sm before:content-[''] before:absolute before:left-0 before:top-0 before:rounded-[.8rem_.8rem_0_0] p-[1.6rem] before:bg-main-gradient before:w-full before:h-[.4rem]">
                                <div className="h-[3rem] w-full mb-[1rem] bg-gray-300"></div>
                                <div className="h-[2rem] w-[9rem] mb-[1rem] bg-gray-300"></div>

                                <div className="h-[8rem] w-full mt-[1rem] bg-gray-300"></div>
                            </div>;

    const StorageItemBox = () => <div className="rounded-[2.4rem] bg-bgCard hover:-top-[.5rem] relative transition-all duration-200 border border-solid border-[#eee] shadow-sm overflow-hidden">
                                    <div className="bg-sub2-gradient p-[1.6rem] relative">
                                        <div className="h-[3rem] w-[80%] mb-[1rem] bg-gray-300"></div>
                                    </div>

                                    <div className="h-[3rem] w-[20%] ml-[2rem] my-[2rem_1rem] bg-gray-300"></div>
                                    <div className="h-[8rem] w-[80%] ml-[2rem] mb-[1rem] bg-gray-300"></div>
                                </div>;

    return (
        <div className="w-full h-full bg-bgPreview">
            <div className="grid grid-cols-4 gap-[1.6rem] mt-[4rem]">
                {[1, 2, 3, 4].map((i) => (
                    type === "plans" ? (<PlansItemBox key={i} />) : <StorageItemBox key={i} />
                ))}
            </div>

            <p className="text-[2rem] font-bold text-textMuted text-center mt-[4rem]">계획안을 불러오고 있습니다...</p>
        </div>
    )
}
