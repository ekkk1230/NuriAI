export interface Plan {
    id: number;
    age: string;
    mainTheme: string;
    curriculum: string;
    plans: Activity[];
    createdAt: string;
    updatedAt: string;
    author: string;
    viewCount: number;
    likeCount: number;
    saveCount: number;
    activeIntro: string;
};

export interface GenerateAIPlanForm {
    age: number | null;
    mainTheme: string;
    selections: string[];
    groupType: string;
}