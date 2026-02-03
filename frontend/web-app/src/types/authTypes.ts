import type { AccountType } from "./accountTypes";

export interface AuthContextType {
	isLoggedIn: boolean;
	accountType: AccountType | null;
	login: (type: AccountType) => void;
	logout: () => void;
}