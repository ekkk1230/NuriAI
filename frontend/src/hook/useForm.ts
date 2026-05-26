import { ChangeEvent, useState } from "react"

export const useForm = <T>(initialState: T) => {
    const [form, setForm] = useState<T>(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setForm(initialState);

    return { form, handleChange, setForm, resetForm };
};