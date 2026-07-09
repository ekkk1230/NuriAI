"use client";

import { useForm } from "@/hook/useForm";
import DynamicInput from "./DynamicInput";
import ModalFooter from "../ModalFooter";
import { useUiStore } from "@/store/useUiStore";
import { usePlanStore } from "@/store/usePlanStore";
import { Plan } from "@/type/Plan";

function EditModal({ plan }: { plan: Plan }) {
    // console.log(plan)
    const { form: planForm, handleChange, setForm, handleActiveChange } = useForm<Plan>(plan);
    const { closeModal } = useUiStore();
    const { updatePlan } = usePlanStore();

    const handleAddItem = (activityIdx: number, field: "objectives" | "relatedCurriculum" | "materials" | "precautions") => {
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

    const handleDeleteItem = (activityIdx: number, field: "objectives" | "relatedCurriculum" | "materials" | "precautions", itemIdx: number) => {
        setForm(prev => {
            const updatedPlans = [...prev.plans];
            const currentArray = updatedPlans[activityIdx][field] || [];
            updatedPlans[activityIdx] = {
                ...updatedPlans[activityIdx],
                [field]: currentArray.filter((_item: any, idx: number) => idx !== itemIdx)
            };
            return { ...prev, plans: updatedPlans };
        });
    };

    const handleUpdateItem = (activityIdx: number, field: "objectives" | "relatedCurriculum" | "materials" | "precautions", itemIdx: number, value: any) => {
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
    };

    const handleSave = () => { 
        // console.log(planForm) 
        updatePlan(planForm);
        closeModal();
    };

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

                        <div className="space-y-[2rem]">
                            <label className="block">
                                <p className="text-[1.6rem] mb-[1rem] font-semibold">활동명</p>
                                <input type="text" value={activity.activityName} name="activityName" onChange={(e) => handleActiveChange(activityIdx, e)} />
                            </label>

                            <label className="block">
                                <p className="text-[1.6rem] mb-[1rem] font-semibold">활동 목표</p>
                                <DynamicInput arr={activity.objectives} inputName="object"
                                    onAddItem={() => handleAddItem(activityIdx, "objectives")}
                                    onDeleteItem={(idx) => handleDeleteItem(activityIdx, "objectives", idx)}
                                    onUpdateItem={(idx, value) => handleUpdateItem(activityIdx, "objectives", idx, value)} />
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

                            <label className="block">
                                <p className="text-[1.6rem] mb-[1rem] font-semibold">교육과정</p>
                                <DynamicInput arr={activity.relatedCurriculum} inputName="curriculum"
                                    onAddItem={() => handleAddItem(activityIdx, "relatedCurriculum")}
                                    onDeleteItem={(idx) => handleDeleteItem(activityIdx, "relatedCurriculum", idx)}
                                    onUpdateItem={(idx, value) => handleUpdateItem(activityIdx, "relatedCurriculum", idx, value)} />
                            </label>

                            <label className="block">
                                <p className="text-[1.6rem] mb-[1rem] font-semibold">준비물</p>
                                <DynamicInput arr={activity.materials} inputName="material"
                                    onAddItem={() => handleAddItem(activityIdx, "materials")}
                                    onDeleteItem={(idx) => handleDeleteItem(activityIdx, "materials", idx)}
                                    onUpdateItem={(idx, value) => handleUpdateItem(activityIdx, "materials", idx, value)} />
                            </label>

                            <label className="block">
                                <p className="text-[1.6rem] mb-[1rem] font-semibold">활동 방법</p>
                                {[
                                    { key: 'introduction' as const, label: '1. 도입', color: 'text-blueActive' },
                                    { key: 'development' as const, label: '2. 전개', color: 'text-main' },
                                    { key: 'conclusion' as const, label: '3. 마무리', color: 'text-[#e67d0c]' }
                                ].map(step => (
                                    <div key={step.key} className="last:mt-0 mt-[1.2rem]">
                                        <p className={`${step.color} text-[1.4rem] font-semibold mb-[1.2rem]`}>{step.label}</p>

                                        {/* 내용 입력 */}
                                        <textarea 
                                            className="p-[1rem] w-full border" 
                                            placeholder="활동 내용"
                                            onChange={(e) => handleActiveChange(activityIdx, e, step.key, 'description')}
                                            value={activity[step.key]?.description || ""} 
                                        />
                                        
                                        {/* 교사 발문 입력 */}
                                        <textarea 
                                            className="p-[1rem] w-full border mt-[0.6rem]" 
                                            placeholder="교사 발문"
                                            onChange={(e) => handleActiveChange(activityIdx, e, step.key, 'teacherTalk')}
                                            value={activity[step.key]?.teacherTalk || ""} 
                                        />
                                    </div>
                                ))}
                            </label>

                            <label className="block">
                                <p className="text-[1.6rem] mb-[1rem] font-semibold">유의점</p>
                                <DynamicInput arr={activity.precautions} inputName="precaution"
                                    onAddItem={() => handleAddItem(activityIdx, "precautions")}
                                    onDeleteItem={(idx) => handleDeleteItem(activityIdx, "precautions", idx)}
                                    onUpdateItem={(idx, value) => handleUpdateItem(activityIdx, "precautions", idx, value)} />
                            </label>
                        </div>
                    </div>
                ))}
            </form>
                                    
            <ModalFooter confirmTxt={"저장"} onConfirm={handleSave} />
        </div>
    );
}

export default EditModal;