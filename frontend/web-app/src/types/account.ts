/**
 * Represents one account, used for registration.
 */
export interface Account {
    firstName: string;          // name
    lastName: string;           // surname
    personNumber: string;       // pnr
    email: string;              // email
    username: string;           // username
    password: string;           // password
}

/**
 * Represents login data.
 */
export type LoginData = Pick<Account, "username" | "password">;
