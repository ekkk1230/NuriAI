export interface User {
    id?: number;
    userId: string;
    userNickname: string;
    userEmail: string;
    userPwd: string;
    userClassAge: number | null;
    role?: string;
}

export interface UserRegisterForm extends User {
    userConfirmPwd: string;
}

export interface LoginUserForm {
    userId: string;
    userPwd: string;
}

export interface ConfirmResult {
    typeText: string;
    value: string;
    isDuplicated: boolean;
}