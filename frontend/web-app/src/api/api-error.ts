export interface ApiError extends Error {
    status?: number;
    isNetworkError: boolean;
}

/**
 * Receives and specifies the API error such that it can be easily used in the frontend API error handling.
 *
 * @param message the error message
 * @param options error status code and if it is a network error
 * @returns a more specified API error
 */
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

/**
 * Checks if an error is an instance of ApiError.
 * This is used to identify if an error is an API error or not.
 * 
 * @param error the error to check
 * @returns true if the error is an ApiError, false otherwise
 */
export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof Error && error.name === "ApiError";
};
