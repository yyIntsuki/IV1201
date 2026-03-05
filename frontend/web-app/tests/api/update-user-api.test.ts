import userUpdateApi from "@/api/update-user-api";
import type { Account } from "@/types/account";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the userUpdateApi function.
 *
 * These tests ensure that userUpdateApi correctly calls the backend API with the right parameters
 * and handles both successful responses and errors appropriately.
 */
describe("userUpdateApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls API with correct payload and authorization header", async () => {
        const accountData: Partial<Account> = {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@example.com",
            personNumber: "19900101-1234",
            username: "janedoe",
        };

        apiRequestMock.mockResolvedValueOnce({});

        const result = await userUpdateApi(accountData, "session-token", 123);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/users/123", {
            method: "PUT",
            data: {
                name: "Jane",
                surname: "Doe",
                pnr: "19900101-1234",
                email: "jane@example.com",
                username: "janedoe",
            },
            headers: { Authorization: "Bearer session-token" },
        });
        expect(result).toBe(true);
    });

    it("handles partial account data updates", async () => {
        const accountData: Partial<Account> = { firstName: "John", username: "newusername" };

        apiRequestMock.mockResolvedValueOnce({});

        const result = await userUpdateApi(accountData, "token", 456);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/users/456", {
            method: "PUT",
            data: { name: "John", surname: undefined, pnr: undefined, email: undefined, username: "newusername" },
            headers: { Authorization: "Bearer token" },
        });
        expect(result).toBe(true);
    });

    it("handles update with all fields populated", async () => {
        const accountData: Partial<Account> = {
            firstName: "Alice",
            lastName: "Wonder",
            email: "alice@example.com",
            personNumber: "19950303-9876",
            username: "alicew",
        };

        apiRequestMock.mockResolvedValueOnce({});

        const result = await userUpdateApi(accountData, "auth-token", 789);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(result).toBe(true);
    });

    it("includes authorization header with session token", async () => {
        const accountData: Partial<Account> = { username: "test" };

        apiRequestMock.mockResolvedValueOnce({});

        await userUpdateApi(accountData, "my-session-token", 1);

        const callArg = apiRequestMock.mock.calls[0][1] as { headers?: Record<string, string> };
        expect(callArg.headers?.Authorization).toBe("Bearer my-session-token");
    });

    it("propagates API errors", async () => {
        const accountData: Partial<Account> = { username: "test" };

        apiRequestMock.mockRejectedValueOnce(new Error("Validation error"));

        await expect(userUpdateApi(accountData, "token", 1)).rejects.toThrow("Validation error");
    });

    it("propagates unauthorized errors", async () => {
        const accountData: Partial<Account> = { username: "test" };

        apiRequestMock.mockRejectedValueOnce(new Error("Invalid or expired token"));

        await expect(userUpdateApi(accountData, "invalid-token", 1)).rejects.toThrow("Invalid or expired token");
    });
});
