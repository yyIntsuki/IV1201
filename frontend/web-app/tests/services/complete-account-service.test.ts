import completeAccountService from "@/services/complete-account-service";
import STORAGE_KEYS from "@/constants/storage-keys";
import type { Account } from "@/types/account";

const verifyTokenApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/verify-token-api", () => ({ default: verifyTokenApiMock }));

const fetchUserDataApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/fetch-user-data-api", () => ({ default: fetchUserDataApiMock }));

const userUpdateApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/update-user-api", () => ({ default: userUpdateApiMock }));

/**
 * Tests for completeAccountService module.
 *
 * These tests ensure the service correctly handles token verification, account completion,
 * and session management with sessionStorage and localStorage.
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
        it("calls verifyTokenApi, fetchUserDataApi and stores session data in sessionStorage", async () => {
            const mockLoginResponse = { access_token: "session-jwt-token", user_id: 123 };

            const mockUserData = {
                user_data: { email: "user@example.com", personNumber: "19900101-1234", username: "", password: "" },
            };

            verifyTokenApiMock.mockResolvedValueOnce(mockLoginResponse);
            fetchUserDataApiMock.mockResolvedValueOnce(mockUserData);

            const result = await completeAccountService.verifyToken("magic-link-token");

            expect(verifyTokenApiMock).toHaveBeenCalledWith("magic-link-token");
            expect(fetchUserDataApiMock).toHaveBeenCalledWith(123);

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBe("session-jwt-token");
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBe("123");

            expect(result).toEqual(mockUserData);
        });

        it("returns account data with all fields", async () => {
            const mockLoginResponse = { access_token: "session-token", user_id: 456 };

            const mockUserData = {
                user_data: {
                    firstName: "John",
                    lastName: "Doe",
                    email: "",
                    personNumber: "",
                    username: "",
                    password: "",
                },
            };

            verifyTokenApiMock.mockResolvedValueOnce(mockLoginResponse);
            fetchUserDataApiMock.mockResolvedValueOnce(mockUserData);

            const result = await completeAccountService.verifyToken("token");

            expect(result).toEqual(mockUserData);
            expect(result).toHaveProperty("user_data");
        });
    });

    /**
     * Tests for completeAccount method.
     */
    describe("completeAccount", () => {
        it("calls userUpdateApi with account data, session token, and user ID", async () => {
            const sessionToken = "session-jwt-token";
            const userId = "123";
            const accountData: Partial<Account> = {
                firstName: "Jane",
                lastName: "Smith",
                username: "janesmith",
                password: "securepass123",
            };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, sessionToken);
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, userId);

            userUpdateApiMock.mockResolvedValueOnce(true);

            await completeAccountService.completeAccount(accountData);

            expect(userUpdateApiMock).toHaveBeenCalledWith(accountData, sessionToken, 123);

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBeNull();
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBeNull();
        });

        it("throws error when no session token is found", async () => {
            const accountData: Partial<Account> = { username: "testuser", password: "password" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, "123");

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow(
                "No session token or user ID found. Please restart the account completion process.",
            );

            expect(userUpdateApiMock).not.toHaveBeenCalled();
        });

        it("throws error when no user ID is found", async () => {
            const accountData: Partial<Account> = { username: "testuser", password: "password" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, "session-token");

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow(
                "No session token or user ID found. Please restart the account completion process.",
            );

            expect(userUpdateApiMock).not.toHaveBeenCalled();
        });

        it("throws error when user ID is invalid", async () => {
            const accountData: Partial<Account> = { username: "testuser", password: "password" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, "session-token");
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, "invalid");

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow(
                "Invalid user ID. Please restart the account completion process.",
            );

            expect(userUpdateApiMock).not.toHaveBeenCalled();
        });

        it("throws error when API returns false", async () => {
            const accountData: Partial<Account> = { username: "testuser" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, "session-token");
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, "123");

            userUpdateApiMock.mockResolvedValueOnce(false);

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow(
                "Failed to update account. Please try again.",
            );
        });

        it("does NOT clean up session storage when API call fails", async () => {
            const sessionToken = "session-token";
            const userId = "999";
            const accountData: Partial<Account> = { username: "test" };

            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, sessionToken);
            sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, userId);

            userUpdateApiMock.mockRejectedValueOnce(new Error("API Error"));

            await expect(completeAccountService.completeAccount(accountData)).rejects.toThrow("API Error");

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBe(sessionToken);
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBe(userId);
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

            expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe("some-token");
        });
    });

    /**
     * Integration test: Full flow.
     */
    describe("full completion flow", () => {
        it("completes the entire account setup flow", async () => {
            const verifyResponse = { access_token: "temp-session-token", user_id: 789 };

            const userData = {
                user_data: { email: "test@example.com", personNumber: "19850505-5555", username: "", password: "" },
            };

            verifyTokenApiMock.mockResolvedValueOnce(verifyResponse);
            fetchUserDataApiMock.mockResolvedValueOnce(userData);

            const accountData = await completeAccountService.verifyToken("magic-token");

            expect(accountData).toEqual(userData);
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBe("temp-session-token");
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBe("789");

            userUpdateApiMock.mockResolvedValueOnce(true);

            await completeAccountService.completeAccount({ username: "newuser", password: "newpass" });

            expect(userUpdateApiMock).toHaveBeenCalledWith(
                { username: "newuser", password: "newpass" },
                "temp-session-token",
                789,
            );

            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN)).toBeNull();
            expect(sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID)).toBeNull();
        });
    });
});
