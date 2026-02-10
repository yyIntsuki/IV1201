import { createContext } from "react";
import type { Session } from "@/types/session";

/**
 * Authentication context to provide session state throughout the app.
 */
const AuthContext = createContext<Session | undefined>(undefined);

export default AuthContext;
