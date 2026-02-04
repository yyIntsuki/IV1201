import { login as loginApi } from "../api/login.api";
import { parseRole } from "../utils/roleParser";

import { STORAGE_KEYS } from "../constants/storageKeys";
import type { Role } from "../types/role";

/**
 * Authentication service to handle login, logout, and session management.
 * This is the actual implementation of the authService used in the AuthProvider.
 */
export const authService = {
	getSession() {
		return {
			isLoggedIn: localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true",
			role: (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || null,
		};
	},

	async login(username: string, password: string): Promise<void> {
		try {
			const roleId = await loginApi(username, password);
			const role = parseRole(roleId);

			localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
			localStorage.setItem(STORAGE_KEYS.ROLE, role);
		} catch {
			throw new Error("Login failed");
		}
	},

	logout() {
		localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
		localStorage.removeItem(STORAGE_KEYS.ROLE);
	}
};