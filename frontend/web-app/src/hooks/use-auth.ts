import { useContext } from "react";
import AuthContext from "@/auth/AuthContext";

/**
 * Retrieves the authentication context, throwing an error if used outside of an AuthProvider.
 * The context returned contains the following properties:
 *   - isLoggedIn: a boolean indicating whether the user is logged in
 *   - role: the user's role, or null if they are not logged in
 *   - token: the user's JWT token, or null if they are not logged in
 *   - login: a function that logs the user in, updating the context's state
 *   - logout: a function that logs the user out, updating the context's state
 * @returns The authentication context
 */
const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export default useAuth;
