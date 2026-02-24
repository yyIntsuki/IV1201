import axios, { type AxiosRequestConfig } from "axios";
import { createApiError } from "./api-error";
import authService from "@/services/auth-service";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const apiClient = axios.create({ baseURL: API_BASE_URL, headers: { "Content-Type": "application/json" } });

/**
 * Makes a request to the API.
 * Automatically adds the Authorization header if a token is present in local storage.
 * Returns the response data as a Promise.
 * Throws an ApiError if the request fails, with the error message and status code.
 * If the error is a network error, isNetworkError is set to true.
 *
 * @template T The type of the response data
 * @param {string} path The path of the request
 * @param {AxiosRequestConfig} [options] The options for the request
 * @returns {Promise<T>} The response data
 */
const apiRequest = async <T>(path: string, options?: AxiosRequestConfig): Promise<T> => {
    try {
        const token = authService.getToken();
        const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient({
            url: path,
            headers: { ...authHeader, ...(options?.headers ?? {}) },
            ...options,
        });
        return response.data as T;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as { message?: string; detail?: string } | undefined;
            const message = data?.detail ?? data?.message ?? `HTTP error ${error.response?.status ?? ""}`.trim();
            throw createApiError(message, { status: error.response?.status, isNetworkError: !error.response });
        }
        throw createApiError("Unexpected error", { isNetworkError: true });
    }
};

export default apiRequest;
