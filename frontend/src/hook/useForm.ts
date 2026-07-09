import { ChangeEvent, useState } from "react";

export const useForm = <T>(initialState: T) => {
    const [form, setForm] = useState<T>(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setForm(initialState);

    const handleActiveChange = (
        activityIdx: number, 
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        step?: 'introduction' | 'development' | 'conclusion',
        field?: 'description' | 'teacherTalk'
    ) => {
        const { name, value } = e.target;

        setForm((prev: any) => {
            const updatedPlans = [...prev.plans];
            const activity = { ...updatedPlans[activityIdx] };

            if (step && field) {
                activity[step] = {
                    ...activity[step],
                    [field]: value
                };
            } else {
                activity[name as keyof typeof activity] = value as any;
            }

            updatedPlans[activityIdx] = activity;
            return { ...prev, plans: updatedPlans };
        });
    };

    return { form, handleChange, setForm, resetForm, handleActiveChange };
};