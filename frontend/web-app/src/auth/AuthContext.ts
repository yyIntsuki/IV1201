import { createContext } from "react";
import type { Session } from "../types/session";

export const AuthContext = createContext<Session | undefined>(undefined);