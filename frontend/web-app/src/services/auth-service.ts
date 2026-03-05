import loginApi from "@/api/login-api";
import resetPasswordApi from "@/api/reset-password-api";
import STORAGE_KEYS from "@/constants/storage-keys";
import { isJwtExpired } from "@/utils/jwt-decoder";

/**
 * Authentication service to handle login, logout, and session management.
 */
const authService = {
    /**
     * Retrieves the authentication token from local storage.
     * If the token is expired or does not exist, it is removed from local storage and null is returned
     * @returns {string | null} The authentication token if it exists and is not expired, null otherwise
     */
    getToken: (): string | null => {
        const getValidToken = (key: string, storage: Storage) => {
            const token = storage.getItem(key);
            if (token && !isJwtExpired(token)) return token;
            storage.removeItem(key); // Cleanup invalid/expired tokens
            return null;
        };

        /* Checks local storage first, then session storage */
        return (
            getValidToken(STORAGE_KEYS.TOKEN, localStorage) ||
            getValidToken(STORAGE_KEYS.COMPLETION_TOKEN, sessionStorage)
        );
    },

    /**
     * Handles the login API call, and if successful sets token to local storage.
     */
    login: async (identifier: string, password: string) => {
        const loginResponse = await loginApi(identifier, password);
        localStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.access_token);
    },

    /**
     * Handles logout, by removing the token from local storage, hence ending the session.
     */
    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.COMPLETION_TOKEN);
    },

    /**
     * Requests a password reset.
     * Sends a magic link to the user's registered email address.
     *
     * @param {string} identifier The email address of the user
     * @returns {Promise<string>} A promise that resolves with a success message
     */
    resetPassword: async (identifier: string): Promise<string> => {
        const response = await resetPasswordApi(identifier);
        return response.message;
    },
};

export default authService;
