import { FormEvent, useState, useEffect } from "react";
import { useMypageStore } from "@/store/useMypageStore";
import { usePlanStore } from "@/store/usePlanStore";
import { useForm } from "./useForm";
import { useWelcomeStore } from "@/store/useWelcomeStore";

export const useMypage = () => {
    const { userPlans, fetchUserPlans, userCollectPlans, fetchUserCollectItem } = usePlanStore();
    const { user } = useWelcomeStore();
    const { inquries, fetchtInquries, addInquriy, deleteInquiry, updateInquiry, insertAnswer, updateAnswer, deleteAnswer } = useMypageStore();
    const { form: inquiryForm, setForm, handleChange, resetForm } = useForm({ title: "", inquiryContent: "" });
    const { form: answerForm, setForm: setAnswerForm, handleChange: handleAnswerChange, resetForm: resetAnswerForm } = useForm({ answerContent: "" });

    useEffect(() => {
        if (user) {
            fetchUserPlans(user);
            fetchUserCollectItem(Number(user.id))
            fetchtInquries();
        }
    }, [user, fetchUserPlans]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [answerOpen, setAnswerOpen] = useState<Record<number, boolean>>({});
    const [writeInQuiry, setWriteInquiry] = useState<boolean>(false);
    const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);

    const handleWrite = () => setWriteInquiry(!writeInQuiry);

    const onSubmitInquiry = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newInquiry = { 
            // id: Date.now(),
            title: inquiryForm.title, 
            inquiryContent: inquiryForm.inquiryContent,
            // status: "PENDING" as const,
            // createdAt: new Date().toISOString(),
            // updatedAt: new Date().toISOString(),
        };
        addInquriy(newInquiry);
        setForm({ title: "", inquiryContent: "" });
        setWriteInquiry(false);
    };

    const toggleInquiry = (id: number) => setAnswerOpen(prev => ({ ...prev, [id]: !prev[id] }));

    const handleDelete = (id: number) => deleteInquiry(id);
    
    const onClickEdit = (item: Inquiry) => {
        setEditingId(item.id!);
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
        };

        updateInquiry(updatedInquiry);
        setEditingId(null);
        resetForm();
    };

    const onSubmitAnswer = (e: FormEvent<HTMLFormElement>, id: number) => {
        // console.log(id)
        e.preventDefault();
        const newAnswer = {
            answerContent: answerForm.answerContent
        };

        insertAnswer(id, newAnswer);
    };

    const handleUpdateAnswer = (e: FormEvent<HTMLFormElement>, id: number) => {
        e.preventDefault();
        // console.log("저장 시도:", answerForm.answerContent);

        if (editingAnswerId === null) return;

        const originalInquiry = inquries.find(q => q.id! === editingAnswerId);
        if (!originalInquiry || originalInquiry.status === "PENDING") return;

        const updatedAnswer = {
            answerContent: answerForm.answerContent
        };

        setEditingAnswerId(null);
        resetAnswerForm();

        updateAnswer(editingAnswerId, updatedAnswer);
    };

    const handledeleteAnswer = (inquiryId: number) => {
        const originalInquiry = inquries.find(q => q.id! === inquiryId);
        if (!originalInquiry || originalInquiry.status === "PENDING") return;

        deleteAnswer(inquiryId);
    };


    return { 
        userPlans, 
        inquries, inquiryForm, 
        answerOpen, toggleInquiry,
        writeInQuiry, handleWrite,
        handleChange, onSubmitInquiry, handleDelete,
        editingId, setEditingId, onClickEdit, handleUpdate, 
        onSubmitAnswer, answerForm, setAnswerForm, handleAnswerChange, resetAnswerForm,
        editingAnswerId, setEditingAnswerId, handleUpdateAnswer, handledeleteAnswer,
        userCollectPlans
    };
}