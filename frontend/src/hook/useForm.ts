import { ChangeEvent, useState } from "react";

export const useForm = <T>(initialState: T) => {
    const [form, setForm] = useState<T>(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setForm(initialState);

    const handleActiveChange = (idx: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setForm((prev: any) => {
            const updatedPlans = [...prev.plans];

            if (name === "content") {
                const stepKey = e.target.dataset.step;

                updatedPlans[idx] = {
                    ...updatedPlans[idx], 
                    content: {
                        ...updatedPlans[idx].content,
                        [stepKey as string]: value
                    }
                };
            } else {
                updatedPlans[idx] = {
                    ...updatedPlans[idx],
                    [name]: value
                };
            }

            return { ...prev, plans: updatedPlans };
        });
    };

    return { form, handleChange, setForm, resetForm, handleActiveChange };
};