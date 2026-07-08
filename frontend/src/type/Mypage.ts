import { User } from "./User";

export interface Answer {
    answerContent: string,
    createdAt: string,
};

export interface Inquiry {
    id?: number,
    title: string,
    inquiryContent: string,
    status?: "PENDING" | "ANSWERED",
    createdAt?: string,
    updatedAt?: string,
    answer?: Answer,
    user?: User
};

export interface InquiryForm {
    title: string;
    inquiryContent: string;
};

export interface AnswerForm {
    answerContent: string;
};

export interface recentViewPlan {
    planId: number;
    mainTheme: string;
    age: string;
    author: string;
    viewedAt: string;
}