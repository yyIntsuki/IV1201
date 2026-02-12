import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import authService from "../services/auth-service";
import { getJwtRemainingTime, getRoleFromJwt, isJwtExpired } from "@/utils/jwt-decoder";
import parseRole from "@/utils/role-parser";

/**
 * AuthProvider component that provides authentication context to its children.
 * Handles login state and account type, as well as login and logout functions.
 * The isLoggedIn and role states are derived and passed down from here.
 */
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(authService.getToken());

    const login = async (username: string, password: string) => {
        await authService.login(username, password);
        setToken(authService.getToken());
    };

    const logout = () => {
        authService.logout();
        setToken(null);
    };

    /* Logs out user when JWT is expired, starts counting only if there is a valid token. */
    useEffect(() => {
        if (!token || isJwtExpired(token)) return;

        const remainingTime = getJwtRemainingTime(token);
        const timer = setTimeout(logout, remainingTime);
        return () => clearTimeout(timer);
    }, [token]);

    /* Derives the login state and role from the JWT instead of storing in local storage */
    const isLoggedIn = !!token && !isJwtExpired(token);
    const role = token ? parseRole(getRoleFromJwt(token)) : null;

    return <AuthContext.Provider value={{ isLoggedIn, role, token, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
