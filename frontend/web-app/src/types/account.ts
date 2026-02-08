import type { Role } from "./role";

/**
 * Represents a user account in the system.
 * Mainly used for registration purposes.
 */
export interface Account {
    username: string;
    password: string;
    role: Role;
    firstName?: string;
    lastName?: string;
    email?: string;
    personNumber?: string;
}