/**
 * Represents login data used in Login.
 * Identifier can be e-mail or username.
 */
export interface LoginData {
    identifier: string;
    password: string;
}

/**
 * Represents password-reset login data used in Login.
 */
export interface PasswordResetData {
    identifier: string;
}
