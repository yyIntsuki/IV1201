import { createContext } from "react";
import type { Session } from "../types/session";

/**
 * Authentication context to provide session state throughout the app.
 */
export const AuthContext = createContext<Session | undefined>(undefined);