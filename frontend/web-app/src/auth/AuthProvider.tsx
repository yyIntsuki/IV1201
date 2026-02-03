import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/auth.service";
import type { Account, AccountType } from "../types/accountTypes";
import { DEFAULT_RECRUITER, DEFAULT_APPLICANT } from "../constants/accounts";
import { STORAGE_KEYS } from "../constants/storageKeys";

/* Initialize default recruiter account. */
const initAccounts = () => {
    const accounts: Account[] = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || "[]",
    );

    const defaults: Account[] = [DEFAULT_RECRUITER, DEFAULT_APPLICANT];

    const mergedAccounts = [...accounts];

    defaults.forEach((defaultAccount) => {
        const exists = mergedAccounts.some(
            (acc) => acc.username === defaultAccount.username,
        );

        if (!exists) mergedAccounts.push(defaultAccount);
    });

    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(mergedAccounts));
};
initAccounts();

/**
 * AuthProvider component that provides authentication context to its children.
 * Handles login state and account type, as well as login and logout functions.
 * @returns The AuthContext.Provider component with the authentication state and functions.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const session = authService.getSession();

    const [isLoggedIn, setIsLoggedIn] = useState(session.isLoggedIn);
    const [accountType, setAccountType] = useState<AccountType | null>(
        session.accountType,
    );

    const login = (type: AccountType) => {
        authService.login(type);
        setIsLoggedIn(true);
        setAccountType(type);
    };

    const logout = () => {
        authService.logout();
        setIsLoggedIn(false);
        setAccountType(null);
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, accountType, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
