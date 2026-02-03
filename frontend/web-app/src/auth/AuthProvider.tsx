import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { Account, AccountType } from "../types/accountTypes";
import {
    DEFAULT_RECRUITER,
    DEFAULT_APPLICANT,
    STORAGE_KEYS,
} from "../constants/accounts";

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
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === "true",
    );
    const [accountType, setAccountType] = useState<AccountType | null>(
        (localStorage.getItem(STORAGE_KEYS.ACCOUNT_TYPE) as AccountType) ||
            null,
    );

    const login = (type: AccountType) => {
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, "true");
        localStorage.setItem(STORAGE_KEYS.ACCOUNT_TYPE, type);
        setIsLoggedIn(true);
        setAccountType(type);
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
        localStorage.removeItem(STORAGE_KEYS.ACCOUNT_TYPE);
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
