/**
 * Represents a user account in the system.
 * Used for registration purposes.
 */
export interface Account {
    firstName: string;          // name
    lastName: string;           // surname
    personNumber: string;       // pnr
    email: string;              // email
    username: string;           // username
    password: string;           // password
}
