interface Answer {
    answerContent: string,
    answeredAt: string,
};

interface Inquiry {
    id?: number,
    title: string,
    inquiryContent: string,
    status?: "PENDING" | "ANSWERED",
    createdAt?: string,
    updatedAt?: string,
    answer?: Answer
};

interface InquiryForm {
    title: string;
    inquiryContent: string;
}

interface AnswerForm {
    answerContent: string;
}