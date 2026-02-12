import type { Role } from "./role";

/**
 * Represents the authentication session state.
 */
export interface Session {
    token: string | null;
    role: Role | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
