import type { Account } from "../types/accountTypes";

export const DEFAULT_RECRUITER: Account = {
	username: "rec",
	password: "ruiter",
	accountType: "recruiter",
	firstName: "Rec",
	lastName: "Ruiter",
	email: "rec@ruiter.com",
	personNumber: "010101-0101",
};

export const DEFAULT_APPLICANT: Account = {
	username: "app",
	password: "licant",
	accountType: "applicant",
	firstName: "App",
	lastName: "Licant",
	email: "app@licant.com",
	personNumber: "101010-1010",
};

export const STORAGE_KEYS = {
	ACCOUNTS: "accounts",
	IS_LOGGED_IN: "isLoggedIn",
	ACCOUNT_TYPE: "accountType",
};