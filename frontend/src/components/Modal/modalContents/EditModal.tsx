"use client";

import { useForm } from "@/hook/useForm";
import DynamicInput from "./DynamicInput";
import { Activity, ChangeEvent } from "react";

function EditModal({ plan }: { plan: Plan }) {
    const { form: planForm, handleChange, setForm } = useForm<Plan>(plan);

    const handleAddItem = (activityIdx: number, field: "objectives") => {
        setForm(prev => {
            const updatedPlans = [...prev.plans];

            const currentArray = updatedPlans[activityIdx][field];
            const nextArray = [...currentArray, ""];

            updatedPlans[activityIdx] = { 
                ...updatedPlans[activityIdx], 
                [field]: nextArray 
            };

            return { ...prev, plans: updatedPlans };
        });
    };

    const handleDeleteItem = (activityIdx: number, field: "objectives", itemIdx: number) => {
        setForm(prev => {
            const updatedPlans = [...prev.plans];
            const currentArray = updatedPlans[activityIdx][field] || [];
            updatedPlans[activityIdx] = {
                ...updatedPlans[activityIdx],
                [field]: currentArray.filter((_: any, idx: number) => idx !== itemIdx)
            };
            return { ...prev, plans: updatedPlans };
        });
    };

    const handleUpdateItem = (activityIdx: number, field: "objectives", itemIdx: number, value: any) => {
        setForm(prev => {
            const updatedPlans = [...prev.plans];
            const updatedArray = [...updatedPlans[activityIdx][field]];

            updatedArray[itemIdx] = value;

            updatedPlans[activityIdx] = {
                ...updatedPlans[activityIdx],
                [field]: updatedArray
            };

            return { ...prev, plans: updatedPlans };
        })
    }

    return (
        <div className="p-[1.6rem] max-h-[75vh] overflow-y-auto text-[1.4rem] w-[80rem]">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-[2.4rem]">
                
                {/* 대주제 */}
                <div className="flex flex-col gap-[0.6rem]">
                    <label className="font-bold text-textDark">대주제</label>
                    <input 
                        type="text" 
                        name="mainTheme" 
                        value={planForm.mainTheme} 
                        onChange={handleChange}
                        className="w-full p-[0.8rem] border border-solid border-[#ddd] rounded-[0.6rem]"
                    />
                </div>

                {/* 세부 활동 루프 */}
                {planForm.plans.map((activity, activityIdx) => (
                    <div key={activityIdx} className="border border-solid border-[#e5e7eb] p-[2rem] rounded-[1.2rem] bg-[#f9fafb] flex flex-col gap-[2rem]">
                        
                        <div className="text-[1.6rem] font-bold text-main border-b border-solid border-[#eee] pb-[0.8rem]">
                            {activity.domain} 영역 설정
                        </div>

                        <form>
                            <label>
                                <p>활동명</p>
                                <input type="text" value={activity.activityName} />
                            </label>

                            <label>
                                <p>활동 목표</p>
                                <DynamicInput arr={activity.objectives} inputName="object" />
                                {/* {activity.objectives.map((item, idx) => (
                                    <>
                                    <div className="flex gap-[.8rem]">
                                        <input key={idx} name="object" type="text" value={item} />
                                        <button className="rounded-[.8rem] text-red-700 bg-red-200 whitespace-nowrap p-[1rem_2rem]">삭제</button>
                                    </div>
                                    <button className="border-[.2rem] border-dashed border-[#ccc] w-full rounded-[.8rem] p-[1rem] mt-[1rem] font-semibold">추가하기</button>
                                    </>
                                ))} */}
                            </label>

                            <label>
                                <p>교육과정</p>
                                <DynamicInput arr={activity.relatedCurriculum} inputName="curriculum" />
                            </label>

                            <label>
                                <p>준비물</p>
                                <DynamicInput arr={activity.materials} inputName="material" />
                            </label>

                            <label>
                                <p>활동 방법</p>
                                {[
                                    { key: 'introduction' as const, label: '1. 도입', color: 'text-blueActive' },
                                    { key: 'development' as const, label: '2. 전개', color: 'text-main' },
                                    { key: 'conclusion' as const, label: '3. 마무리', color: 'text-[#e67d0c]' }
                                ].map(step => (
                                    <label key={step.key}>
                                        <p className={`${step.color}`}>{step.label}</p>
                                        <textarea name="content" value={activity.content[step.key] || ""} />
                                       
                                    </label>
                                ))}
                            </label>

                            <label>
                                <p>유의점</p>
                                <DynamicInput arr={activity.precautions} inputName="pricuation" />
                            </label>
                        </form>
                    </div>
                ))}
            </form>
        </div>
    );
}

export default EditModal;