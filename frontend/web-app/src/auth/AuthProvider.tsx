import { useState } from "react";
import AuthContext from "./AuthContext";
import authService from "../services/auth-service";
import STORAGE_KEYS from "@/constants/storage-keys";
import type { Role } from "@/types/role";

/**
 * AuthProvider component that provides authentication context to its children.
 * Handles login state and account type, as well as login and logout functions.
 * @returns The AuthContext.Provider component with the authentication state and functions.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const session = authService.getSession();

    const [isLoggedIn, setIsLoggedIn] = useState(session.isLoggedIn);
    const [role, setRole] = useState<Role | null>(session.role);
    const [token, setToken] = useState<string | null>(session.token);

    const login = async (username: string, password: string) => {
        const userRole = await authService.login(username, password);
        setIsLoggedIn(true);
        setRole(userRole);
        setToken(localStorage.getItem(STORAGE_KEYS.TOKEN));
    };

    const logout = () => {
        authService.logout();
        setIsLoggedIn(false);
        setRole(null);
        setToken(null);
    };

    return <AuthContext.Provider value={{ isLoggedIn, role, token, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
