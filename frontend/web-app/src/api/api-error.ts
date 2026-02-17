export interface ApiError extends Error {
    status?: number;
    isNetworkError: boolean;
}

export const createApiError = (
    message: string,
    options: { status?: number; isNetworkError?: boolean } = {},
): ApiError => {
    const error = new Error(message) as ApiError;

    error.name = "ApiError";
    error.status = options.status;
    error.isNetworkError = options.isNetworkError ?? false;

    return error;
};

export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof Error && error.name === "ApiError";
};
