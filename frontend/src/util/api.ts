import { API_BASE_URL } from "@/constants/api";
import { useWelcomeStore } from "@/store/useWelcomeStore";

export const apiFetch = async(url: string, options: any = {}) => {
    const token = useWelcomeStore.getState().accessToken;

    const targetUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization" : `Bearer ${token}`} : {}),
        ...options.headers
    };

    const response = fetch(targetUrl, { ...options, headers });

    if ((await response).status === 403) {
        console.warn("인증 실패, 로그아웃 처리");
        useWelcomeStore.getState().logoutUser(); 
        window.location.href = "/welcome/login";
        console.error("403 Forbidden: 토큰이 유효하지 않거나 권한이 없습니다.");
        return response;
    }

    return response;
}