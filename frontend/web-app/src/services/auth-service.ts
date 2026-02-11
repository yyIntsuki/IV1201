import loginApi from "@/api/login-api";
import STORAGE_KEYS from "@/constants/storage-keys";
import type { Role } from "@/types/role";
import parseRole from "@/utils/role-parser";

/**
 * Authentication service to handle login, logout, and session management.
 * This is the actual implementation of the authService used in the AuthProvider.
 */
const authService = {

    /**
     * Get current session from localStorage
     * @returns the session state with isLoggedIn and role information
     */
    getSession() {
        return {
            isLoggedIn: localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true",
            role: (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || null,
            token: localStorage.getItem(STORAGE_KEYS.TOKEN),
        };
    },

    /**
     * Login API call and save to localStorage
     * @returns the parsed role for convenience
     */
    async login(username: string, password: string): Promise<Role> {
        try {
            const loginResponse = await loginApi(username, password);
            const role = parseRole(loginResponse.role_id);

            localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
            localStorage.setItem(STORAGE_KEYS.ROLE, role);
            localStorage.setItem(STORAGE_KEYS.TOKEN, loginResponse.access_token);

            return role;
        } catch {
            throw new Error("Login failed");
        }
    },

    /**
     * Logout: clears session
     */
    logout() {
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.ROLE);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
};

export default authService;
