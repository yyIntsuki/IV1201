import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
    sub: string;
    role_id: number;
    exp: number;
}

/**
 * Decode a JWT.
 * @param token JWT string
 * @returns decoded payload or null if invalid
 */
export const decodeJwt = (token: string): JwtPayload | null => {
    try { return jwtDecode<JwtPayload>(token); } catch { return null; }
};

/**
 * Check if JWT is expired.
 * @param token JWT string
 * @returns true if expired or invalid
 */
export const isJwtExpired = (token: string): boolean => {
    const decoded = decodeJwt(token);
    if (!decoded) return true;
    return decoded.exp * 1000 < Date.now();
};

/**
 * Returns remaining milliseconds until the token expires
 * @param token JWT string
 * @returns milliseconds left, or 0 if expired/invalid
 */
export const getJwtRemainingTime = (token: string): number => {
    const decoded = decodeJwt(token);
    if (!decoded) return 0;

    const expiresAt = decoded.exp * 1000;
    const remaining = expiresAt - Date.now();
    return remaining > 0 ? remaining : 0;
};

/**
 * Extract role from JWT.
 * @param token JWT string
 * @returns role_id or null if invalid
 */
export const getRoleFromJwt = (token: string): number | null => {
    const decoded = decodeJwt(token);
    return decoded ? decoded.role_id : null;
};
