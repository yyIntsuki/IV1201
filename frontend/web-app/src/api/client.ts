import axios, { type AxiosRequestConfig } from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Base API client using axios.
 */
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
export const apiRequest = async <T>(
    path: string,
    options?: AxiosRequestConfig,
): Promise<T> => {
    try {
        const response = await apiClient({
            url: path,
            ...options,
        });
        return response.data as T;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.message ?? `HTTP error ${error.response?.status}`;
            throw new Error(message);
        }
        throw new Error("Unexpected error");
    }
};