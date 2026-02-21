import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import authService from "@/services/auth-service";
import loginApi from "@/api/login-api";
import STORAGE_KEYS from "@/constants/storage-keys";
import * as jwtDecoder from "@/utils/jwt-decoder";

vi.mock("@/api/login-api", () => ({ default: vi.fn() }));

/**
 * Tests for authService module, covering token retrieval, login, and logout functionality.
 *
 * Mocks loginApi and jwtDecoder to isolate authService behavior.
 */
describe("authService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * Tests for getToken method, ensuring correct behavior when token is present, expired, or absent.
     */
    describe("getToken", () => {
        it("returns token if present and not expired", () => {
            const token = "valid-token";

            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
            vi.spyOn(jwtDecoder, "isJwtExpired").mockReturnValue(false);

            const result = authService.getToken();

            expect(result).toBe(token);
        });

        it("returns null and removes token if expired", () => {
            const token = "expired-token";

            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
            vi.spyOn(jwtDecoder, "isJwtExpired").mockReturnValue(true);

            const result = authService.getToken();

            expect(result).toBeNull();
            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
        });

        it("returns null if no token exists", () => {
            const result = authService.getToken();
            expect(result).toBeNull();
        });
    });

    /**
     * Tests for login method, verifying that it calls loginApi and stores the token in localStorage on success.
     */
    describe("login", () => {
        it("calls loginApi and stores access token in localStorage", async () => {
            const fakeResponse = { access_token: "jwt-token", token_type: "bearer", role_id: 2 };

            vi.mocked(loginApi).mockResolvedValueOnce(fakeResponse);

            await authService.login("user", "password");

            expect(loginApi).toHaveBeenCalledWith("user", "password");
            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe("jwt-token");
        });
    });

    /**
     * Tests for logout method, ensuring that it removes the token from localStorage.
     */
    describe("logout", () => {
        it("removes token from localStorage", () => {
            localStorage.setItem(STORAGE_KEYS.TOKEN, "jwt-token");

            authService.logout();

            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
        });
    });
});
