import axios, { type AxiosRequestConfig } from "axios";
import { createApiError } from "./api-error";
import STORAGE_KEYS from "@/constants/storage-keys";

const API_BASE_URL = "http://127.0.0.1:8000";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Generic API request helper.
 * Automatically returns parsed JSON.
 */
const apiRequest = async <T>(
    path: string,
    options?: AxiosRequestConfig,
): Promise<T> => {
    try {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient({
            url: path,
            headers: {
                ...authHeader,
                ...(options?.headers ?? {}),
            },
            ...options,
        });
        return response.data as T;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as
                | { message?: string; detail?: string }
                | undefined;

            const message =
                data?.detail ??
                data?.message ??
                `HTTP error ${error.response?.status ?? ""}`.trim();

            throw createApiError(message, {
                status: error.response?.status,
                isNetworkError: !error.response,
            });
        }

        throw createApiError("Unexpected error", {
            isNetworkError: true,
        });
    }
};

export default apiRequest;
