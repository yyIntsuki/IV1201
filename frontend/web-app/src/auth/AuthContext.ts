import { createContext } from "react";
import type { Session as AuthContextType } from "@/types/session";

/**
 * Authentication context to provide session state throughout the app.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
