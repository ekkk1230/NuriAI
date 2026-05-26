import { ReactNode } from "react";
import { create } from "zustand";

type modalType = "CHECK" | "CONFIRM" | null;

interface UiStore {
    isOpen: boolean,
    modalTitle: string,
    modalType: modalType,
    modalContent: ReactNode,
    onConfirm: (() => void) | null,
    openModal: (modalTit: string, modalType: modalType, modalContent: ReactNode, onConfirm?: () => void) => void,
    closeModal: () => void,
};

export const useUiStore = create<UiStore>((set) => ({
    isOpen: false,
    modalTitle: "",
    modalType: null,
    modalContent: null,
    onConfirm: null,
    openModal: (modalTit, modalType, modalContent, onConfirm) => {
        set({
            isOpen: true,
            modalTitle: modalTit,
            modalType: modalType,
            modalContent: modalContent,
            onConfirm: onConfirm || null,
        });
    },
    closeModal: () => {
        set({
            isOpen: false,
            modalTitle: '',
            modalType: null,
            modalContent: null,
            onConfirm: null,
        });
    }
}));