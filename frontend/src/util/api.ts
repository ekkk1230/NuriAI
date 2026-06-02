import { API_BASE_URL } from "@/constants/api";

export const apiFetch = async (url: string, options: any = {}) => {
    const token = localStorage.getItem("accessToken");

    const targetUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...options.headers
    };

    // console.log("요청 헤더 확인:", headers);

    return fetch(targetUrl, { ...options, headers, });
}