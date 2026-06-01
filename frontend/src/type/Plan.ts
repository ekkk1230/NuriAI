export interface Plan {
    id: number;
    age: string;
    mainTheme: string;
    curriculum: string;
    plans: Activity[];
    createdAt: string;
    updatedAt: string;
};

export interface GenerateAIPlanForm {
    age: number | null;
    mainTheme: string;
    selections: string[];
    groupType: string;
}