import { useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import ErrorContext from "@/errors/ErrorContext";
import { isApiError } from "@/api/api-error";

interface UseErrorResult {
    showError: (message: string) => void;
    showApiError: (error: unknown, scope?: string) => void;
    getApiErrorMessage: (error: unknown, scope?: string) => string;
}

/**
 * Hook providing error handling functionality.
 * Returns an object containing showError and showApiError functions.
 * showError directly triggers the error toast with the provided message.
 * showApiError takes an error object and an optional scope string, and determines the appropriate error message based on the error type.
 * getApiErrorMessage is a helper function that determines the appropriate error message based on the error type.
 * Use within an ErrorProvider component to properly display errors to the user.
 */
const useError = (): UseErrorResult => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useError must be used within an ErrorProvider");

    const { t } = useTranslation();

    /**
     * Determines the appropriate error message based on the error type.
     */
    const getApiErrorMessage = useCallback(
        (error: unknown, scope?: string): string => {
            if (isApiError(error)) {
                if (error.isNetworkError) return t("errors.network");

                if (error.status === 400 && scope === "register") {
                    const msg = error.message?.toLowerCase() ?? "";

                    if (msg.includes("email")) return t("errors.registration.emailExists");
                    if (msg.includes("username")) return t("errors.registration.usernameExists");
                    if (msg.includes("personal")) return t("errors.registration.pnrExists");
                }

                if (error.status === 401)
                    return scope === "login" ? t("errors.login.authentication") : t("errors.unauthorized");

                if (error.status && error.status >= 500) return t("errors.server");

                return error.message || t("errors.server");
            }

            if (error instanceof Error && error.message) return error.message;

            return t("errors.server");
        },
        [t],
    );

    /**
     * Handles API errors by determining the appropriate message and displaying it.
     */
    const showApiError = useCallback(
        (error: unknown, scope?: string): void => {
            context.showError(getApiErrorMessage(error, scope));
        },
        [context, getApiErrorMessage],
    );

    return { showError: context.showError, showApiError, getApiErrorMessage };
};

export default useError;
