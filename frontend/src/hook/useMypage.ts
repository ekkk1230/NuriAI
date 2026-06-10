import { FormEvent, useState, useEffect } from "react";
import { useMypageStore } from "@/store/useMypageStore";
import { usePlanStore } from "@/store/usePlanStore";
import { useForm } from "./useForm";
import { useWelcomeStore } from "@/store/useWelcomeStore";

export const useMypage = () => {
    const { userPlans, fetchUserPlans, userCollectPlans, fetchUserCollectItem } = usePlanStore();
    const { user } = useWelcomeStore();
    const { inquries, addInquriy, deleteInquiry, updateInquiry } = useMypageStore();
    const { form: inquiryForm, setForm, handleChange, resetForm } = useForm({ title: "", inquiryContent: "" });

    useEffect(() => {
        if (user) {
            fetchUserPlans(user);
            fetchUserCollectItem(Number(user.id))
        }
    }, [user, fetchUserPlans]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [answerOpen, setAnswerOpen] = useState<Record<number, boolean>>({});
    const [writeInQuiry, setWriteInquiry] = useState<boolean>(false);

    const handleWrite = () => setWriteInquiry(!writeInQuiry);

    const onSubmitInquiry = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newInquiry = { 
            id: Date.now(),
            title: inquiryForm.title, 
            inquiryContent: inquiryForm.inquiryContent,
            status: "PENDING" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addInquriy(newInquiry);
        setWriteInquiry(false);
    };

    const toggleAnswer = (id: number) => setAnswerOpen(prev => ({ ...prev, [id]: !prev[id] }));

    const handleDelete = (id: number) => deleteInquiry(id);
    
    const onClickEdit = (item: Inquiry) => {
        setEditingId(item.id);
        setForm({
            title: item.title,
            inquiryContent: item.inquiryContent,
        });
    };

    const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (editingId === null) return;
        
        const originalInquiry = inquries.find(q => q.id! === editingId);
        if (!originalInquiry || originalInquiry.status === "ANSWERED") return;
        
        const updatedInquiry = {
            id: editingId,
            title: inquiryForm.title,
            inquiryContent: inquiryForm.inquiryContent,
            status: originalInquiry.status,
            createdAt: originalInquiry?.createdAt,
            updatedAt: new Date().toISOString(),
        };

        updateInquiry(updatedInquiry);
        setEditingId(null);
        resetForm();
    };

    return { 
        userPlans, 
        inquries, inquiryForm, 
        answerOpen, toggleAnswer,
        writeInQuiry, handleWrite,
        handleChange, onSubmitInquiry, handleDelete,
        editingId, setEditingId, onClickEdit, handleUpdate,
        userCollectPlans
    };
}