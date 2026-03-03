import completeAccountService from "@/services/complete-account-service";
import STORAGE_KEYS from "@/constants/storage-keys";
import type { Account } from "@/types/account";

const verifyTokenApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/verify-token-api", () => ({ default: verifyTokenApiMock }));

const completeAccountApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/complete-account-api", () => ({ default: completeAccountApiMock }));

/**
 * Tests for completeAccountService module.
 *
 * These tests ensure the service correctly handles token verification, account completion, and session management with
 * sessionStorage and localStorage.
 */
describe("completeAccountService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /**
     * Tests for verifyToken method.
     */
    describe("verifyToken", () => {
        it("calls verifyTokenApi and stores session data in sessionStorage", async () => {
            const mockResponse = {
                session_token: "session-jwt-token",
                user_id: 123,
                account_data: { email: "user@example.com", personNumber: "19900101-1234", username: "", password: "" },
            };

            verifyTokenApiMock.mockResolvedValueOnce(mockResponse);

            const result = await completeAccountService.verifyToken("magic-link-token");

            expect(verifyTokenApiMock).toHaveBeenCalledWith("magic-link-token");

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBe("session-jwt-token");
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBe("123");

            expect(result).toEqual(mockResponse.account_data);
        });

        it("returns account data with all fields", async () => {
            const mockResponse = {
                session_token: "session-token",
                user_id: 456,
                account_data: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "",
                    personNumber: "",
                    username: "",
                    password: "",
                },
            };

            verifyTokenApiMock.mockResolvedValueOnce(mockResponse);

            const result = await completeAccountService.verifyToken("token");

            expect(result).toEqual(mockResponse.account_data);
            expect(result).toHaveProperty("firstName");
            expect(result).toHaveProperty("lastName");
        });
    });

    /**
     * Tests for completeAccount method.
     */
    describe("completeAccount", () => {
        it("calls completeAccountApi with account data and session token", async () => {
            const sessionToken = "session-jwt-token";
            const accountData: Partial<Account> = {
                firstName: "Jane",
                lastName: "Smith",
                username: "janesmith",
                password: "securepass123",
            };

            const mockResponse = { access_token: "full-auth-token", token_type: "bearer" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, sessionToken);
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, "123");

            completeAccountApiMock.mockResolvedValueOnce(mockResponse);

            await completeAccountService.completeAccount(accountData);

            expect(completeAccountApiMock).toHaveBeenCalledWith(accountData, sessionToken);

            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe("full-auth-token");

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBeNull();
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBeNull();
        });

        it("throws error when no session token is found", async () => {
            const accountData: Partial<Account> = { username: "testuser", password: "password" };

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow(
                "No session token found. Please restart the account completion process.",
            );

            expect(completeAccountApiMock).not.toHaveBeenCalled();
        });

        it("cleans up session storage even if API call fails", async () => {
            const sessionToken = "session-token";
            const accountData: Partial<Account> = { username: "test" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, sessionToken);
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, "999");

            completeAccountApiMock.mockRejectedValueOnce(new Error("API Error"));

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow("API Error");

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBe(sessionToken);
        });
    });

    /**
     * Tests for clearSession method.
     */
    describe("clearSession", () => {
        it("removes completion token and user ID from sessionStorage", () => {
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, "session-token");
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, "123");

            completeAccountService.clearSession();

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBeNull();
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBeNull();
        });

        it("does not throw error when session storage is already empty", () => {
            expect(() => completeAccountService.clearSession()).not.toThrow();
        });

        it("does not affect localStorage", () => {
            localStorage.setItem(STORAGE_KEYS.TOKEN, "some-token");
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, "session-token");

            completeAccountService.clearSession();

            // localStorage should remain unchanged
            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe("some-token");
        });
    });

    /**
     * Integration test: Full flow.
     */
    describe("full completion flow", () => {
        it("completes the entire account setup flow", async () => {
            const verifyResponse = {
                session_token: "temp-session-token",
                user_id: 789,
                account_data: { email: "test@example.com", personNumber: "19850505-5555", username: "", password: "" },
            };

            verifyTokenApiMock.mockResolvedValueOnce(verifyResponse);

            const accountData = await completeAccountService.verifyToken("magic-token");

            expect(accountData.email).toBe("test@example.com");
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBe("temp-session-token");

            const completeResponse = { access_token: "final-auth-token", token_type: "bearer" };

            completeAccountApiMock.mockResolvedValueOnce(completeResponse);

            await completeAccountService.completeAccount({ username: "newuser", password: "newpass" });

            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe("final-auth-token");
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBeNull();
        });
    });
});
