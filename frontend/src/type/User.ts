export interface User {
    id: number;
    userId: string;
    userNickname: string;
    userPwd: string;
    userClassAge: number | null;
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