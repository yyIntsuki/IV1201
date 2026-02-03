import { useState } from "react";
import { AuthContext } from "./AuthContext";
import type { AccountType } from "./authTypes";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true",
    );
    const [accountType, setAccountType] = useState<AccountType>(
        localStorage.getItem("accountType") as AccountType,
    );

    const login = (type: AccountType) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("accountType", type!);
        setIsLoggedIn(true);
        setAccountType(type);
    };

    const logout = () => {
        localStorage.clear();
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
