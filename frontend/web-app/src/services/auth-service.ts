import loginApi from "@/api/login-api";
import STORAGE_KEYS from "@/constants/storage-keys";
import { isJwtExpired } from "@/utils/jwt-decoder";

/**
 * Authentication service to handle login, logout, and session management.
 * This is the actual implementation of the authService used in the AuthProvider.
 */
const authService = {
    /**
     * Gets the current JWT from local storage, if exists.
     * @returns the JWT
     */
    getToken(): string | null {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token || isJwtExpired(token)) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            return null;
        }
        return token;
    },

    /**
     * Handles the login API call, and if successful sets token to local storage.
     */
    async login(username: string, password: string) {
        const loginResponse = await loginApi(username, password);
        localStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.access_token);
    },

    /**
     * Handles logout, by removing the token from local storage, hence ending the session.
     */
    logout() { localStorage.removeItem(STORAGE_KEYS.TOKEN); }
};

export default authService;
