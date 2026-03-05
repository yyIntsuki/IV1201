import fetchUserDataApi from "@/api/fetch-user-data-api";
import type { Account } from "@/types/account";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the fetchUserDataApi function.
 *
 * These tests ensure that fetchUserDataApi calls the correct endpoint and handles both
 * successful responses and errors appropriately.
 */
describe("fetchUserDataApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls the correct endpoint with GET", async () => {
        const mockResponse: Partial<Account> = {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane@example.com",
            personNumber: "19900101-1234",
            username: "janedoe",
            password: "",
        };

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        await fetchUserDataApi(42);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/users/42", expect.objectContaining({ method: "GET" }));
    });

    it("returns user account data on success", async () => {
        const mockResponse: Partial<Account> = {
            firstName: "John",
            lastName: "Smith",
            email: "john@example.com",
            personNumber: "19850515-5678",
            username: "johnsmith",
            password: "",
        };

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await fetchUserDataApi(1);

        expect(result).toEqual(mockResponse);
        expect(result.firstName).toBe("John");
        expect(result.email).toBe("john@example.com");
    });

    it("returns partial account data when some fields are empty", async () => {
        const mockResponse: Partial<Account> = {
            firstName: "",
            lastName: "",
            email: "incomplete@example.com",
            personNumber: "19900101-1234",
            username: "",
            password: "",
        };

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await fetchUserDataApi(99);

        expect(result).toEqual(mockResponse);
        expect(result.email).toBe("incomplete@example.com");
    });

    it("propagates API errors", async () => {
        apiRequestMock.mockRejectedValueOnce(new Error("Unauthorized"));

        await expect(fetchUserDataApi(1)).rejects.toThrow("Unauthorized");
    });

    it("propagates not found errors", async () => {
        apiRequestMock.mockRejectedValueOnce(new Error("User not found"));

        await expect(fetchUserDataApi(999)).rejects.toThrow("User not found");
    });
});
