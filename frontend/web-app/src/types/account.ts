/**
 * Represents a user account in the system.
 * Used for registration purposes.
 */
export interface Account {
    firstName: string;
    lastName: string;
    email: string;
    personNumber: string;
    username: string;
    password: string;
}