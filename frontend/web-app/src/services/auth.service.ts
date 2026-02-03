import { STORAGE_KEYS } from "../constants/storageKeys";
import type { AccountType } from "../types/accountTypes";

export const authService = {
	getSession() {
		return {
			isLoggedIn:
				localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true",
			accountType:
				(localStorage.getItem(
					STORAGE_KEYS.ACCOUNT_TYPE,
				) as AccountType) || null,
		};
	},

	login(accountType: AccountType) {
		localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
		localStorage.setItem(STORAGE_KEYS.ACCOUNT_TYPE, accountType);
	},

	logout() {
		localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
		localStorage.removeItem(STORAGE_KEYS.ACCOUNT_TYPE);
	},
};