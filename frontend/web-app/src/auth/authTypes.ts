export type AccountType = "applicant" | "recruiter" | null;

export interface AuthContextType {
	isLoggedIn: boolean;
	accountType: AccountType;
	login: (type: AccountType) => void;
	logout: () => void;
}
