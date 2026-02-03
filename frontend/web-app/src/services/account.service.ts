import type { Account } from "../types/accountTypes";
import { STORAGE_KEYS } from "../constants/storageKeys";

export const accountService = {
	getAll(): Account[] {
		return JSON.parse(
			localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || "[]",
		);
	},

	findByCredentials(
		username: string,
		password: string,
	): Account | undefined {
		return this.getAll().find(
			acc => acc.username === username && acc.password === password,
		);
	},

	usernameExists(username: string): boolean {
		return this.getAll().some(acc => acc.username === username);
	},

	create(account: Account) {
		const accounts = this.getAll();
		localStorage.setItem(
			STORAGE_KEYS.ACCOUNTS,
			JSON.stringify([...accounts, account]),
		);
	},
};
