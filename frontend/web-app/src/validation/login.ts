export const validateUsername = (username: string): boolean =>
    username.trim().length >= 4;

export const validatePassword = (password: string): boolean =>
    password.trim().length >= 4;

export const isLoginFormValid = (username: string, password: string): boolean =>
    validateUsername(username) && validatePassword(password);
