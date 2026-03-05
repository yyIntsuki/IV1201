import verifyTokenApi from "@/api/verify-token-api";

const apiRequestMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/client", () => ({ default: apiRequestMock }));

/**
 * Unit tests for the verifyTokenApi function.
 *
 * These tests ensure that verifyTokenApi correctly calls the backend API with the right parameters
 * and handles both successful responses and errors appropriately.
 */
describe("verifyTokenApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Calls /api/v1/magic-login/verify with POST and token in the request body.
     */
    it("calls /api/v1/magic-login/verify with POST and token in request body", async () => {
        const mockResponse = { access_token: "session-jwt-token", user_id: 123 };
        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await verifyTokenApi("magic-link-token");

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/magic-login/verify", {
            method: "POST",
            data: { token: "magic-link-token" },
        });
        expect(result).toEqual(mockResponse);
    });

    /**
     * Returns access token and user ID on successful verification.
     */
    it("returns access token and user ID on success", async () => {
        const mockResponse = { access_token: "test-access-token", user_id: 456 };

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const result = await verifyTokenApi("valid-token");

        expect(result.access_token).toBe("test-access-token");
        expect(result.user_id).toBe(456);
    });

    /**
     * Propagates errors thrown by the API client without modification.
     */
    it("propagates API errors", async () => {
        apiRequestMock.mockRejectedValueOnce(new Error("Invalid or expired token"));

        await expect(verifyTokenApi("invalid-token")).rejects.toThrow("Invalid or expired token");
    });
});
