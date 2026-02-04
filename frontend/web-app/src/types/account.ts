import type { Role } from "./role";

export interface Account {
	username: string;
	password: string;
	role: Role;
	firstName?: string;
	lastName?: string;
	email?: string;
	personNumber?: string;
}