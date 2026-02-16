import { useContext } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import ErrorContext from "@/errors/ErrorContext";

interface ApiErrorResult {
    showError: (message: string) => void;
    showApiError: (error: unknown) => void;
    getApiErrorMessage: (error: unknown) => string;
}

/**
 * Enhanced error hook that provides both general error display and API error handling.
 */
const useError = (): ApiErrorResult => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useError must be used within an ErrorProvider");

    const { t } = useTranslation();

    /**
     * Determines the appropriate error message based on the error type.
     */
    const getApiErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as { message?: string; detail?: string } | undefined;
            const message = data?.detail ?? data?.message;

            if (!error.response) {
                return t("errors.network");
            } else if (status === 401) {
                return t("errors.authentication");
            } else if (status && status >= 500) {
                return t("errors.server");
            } else if (message) {
                return message;
            }
        }

        return t("errors.server");
    };

    /**
     * Handles API errors by determining the appropriate message and displaying it.
     */
    const showApiError = (error: unknown): void => {
        const errorMessage = getApiErrorMessage(error);
        context.showError(errorMessage);
    };

    return {
        showError: context.showError,
        showApiError,
        getApiErrorMessage
    };
};

export default useError;
