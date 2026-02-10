export interface Account {
    firstName: string;          // name
    lastName: string;           // surname
    personNumber: string;       // pnr
    email: string;              // email
    username: string;           // username
    password: string;           // password
}

export type LoginData = Pick<Account, "username" | "password">;
