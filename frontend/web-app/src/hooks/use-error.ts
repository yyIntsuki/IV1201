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
 * Retrieves the error context, throwing an error if used outside of an ErrorProvider.
 *
 * The context returned contains the following properties:
 *   - showError: a function that displays an error message to the user
 *   - showApiError: a function that handles API errors by determining the appropriate message and displaying it
 *   - getApiErrorMessage: a function that determines the appropriate error message based on the error type
 *
 * @returns The error context
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

                    /*
                     * Conflict errors, i.e. the value is valid but already taken.
                     * Checked first and require "already" to avoid mismatching validation errors whose messages also contain
                     * field names like "email" or "username".
                     */
                    if (msg.includes("already") && msg.includes("email")) return t("errors.registration.emailExists");
                    if (msg.includes("already") && msg.includes("username")) return t("errors.registration.usernameExists");
                    if (msg.includes("already") && msg.includes("personal")) return t("errors.registration.pnrExists");

                    /* Validation errors, i.e. the submitted value is malformed */
                    if (msg.includes("name")) return t("errors.registration.invalidName");
                    if (msg.includes("username")) return t("errors.registration.invalidUsername");
                    if (msg.includes("personal") || msg.includes("pnr")) return t("errors.registration.invalidPnr");
                    if (msg.includes("password")) return t("errors.registration.invalidPassword");
                    if (msg.includes("email")) return t("errors.registration.invalidEmail");
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
