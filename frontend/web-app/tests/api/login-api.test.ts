import loginApi from "@/api/login-api";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the loginApi function.
 *
 * These tests ensure that the loginApi correctly calls the backend API with the right parameters
 * and handles both successful responses and errors appropriately.
 */
describe("loginApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Calls /api/v1/login with POST and credentials in the request body,
     * ensuring credentials are never sent as query parameters.
     */
    it("calls /api/v1/login with POST and credentials in request body", async () => {
        const mockResponse = { access_token: "fake-jwt", token_type: "bearer" };
        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await loginApi("user123", "password123");

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/login", {
            method: "POST",
            data: { username: "user123", password: "password123" },
        });
        expect(result).toEqual(mockResponse);
    });

    /**
     * Propagates errors thrown by the API client without modification.
     */
    it("propagates API errors", async () => {
        apiRequestMock.mockRejectedValueOnce(new Error("Unauthorized"));

        await expect(loginApi("user", "wrong")).rejects.toThrow("Unauthorized");
    });
});
