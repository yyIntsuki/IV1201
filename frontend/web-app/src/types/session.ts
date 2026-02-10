import type { Role } from "./role";

/**
 * Represents the authentication session state.
 */
export interface Session {
    isLoggedIn: boolean;
    role: Role | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}
