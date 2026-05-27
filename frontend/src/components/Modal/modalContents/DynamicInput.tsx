function DynamicInput({ arr, inputName, onAddItem, onDeleteItem, onUpdateItem }: { arr: string[], inputName: string, onAddItem: () => void, onDeleteItem: (idx: number) => void, onUpdateItem: (idx: number, value: string) => void }) {
    return (
        <>
            {arr.map((item, idx) => (
                <div key={idx} className="mb-[1rem]"> 
                    <div className="flex gap-[.8rem]">
                        <input onChange={(e) => onUpdateItem(idx, e.target.value)} name={inputName} type="text" value={item} />
                        <button type="button" onClick={() => onDeleteItem(idx)} className="rounded-[.8rem] text-red-700 bg-red-200 whitespace-nowrap p-[1rem_2rem]">
                            삭제
                        </button>
                    </div>
                </div>
            ))}
            
            <button type="button" onClick={() => onAddItem()} className="border-[.2rem] border-dashed border-[#ccc] w-full rounded-[.8rem] p-[1rem] mt-[0.4rem] font-semibold">
                추가하기
            </button>
        </>
    );
}

export default DynamicInput