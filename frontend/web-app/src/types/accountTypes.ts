export type AccountType = "applicant" | "recruiter";

export interface Account {
	username: string;
	password: string;
	accountType: AccountType;
	firstName?: string;
	lastName?: string;
	email?: string;
	personNumber?: string;
}