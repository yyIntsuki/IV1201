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

    it("calls /api/v1/login with POST and correct params", async () => {
        const mockResponse = { access_token: "fake-jwt", token_type: "bearer", role_id: 2 };

        apiRequestMock.mockResolvedValueOnce(mockResponse);

        const identifier = "user123";
        const password = "password123";

        const result = await loginApi(identifier, password);

        expect(apiRequestMock).toHaveBeenCalledOnce();
        expect(apiRequestMock).toHaveBeenCalledWith("/api/v1/login", {
            method: "POST",
            params: { username: identifier, password },
        });

        expect(result).toEqual(mockResponse);
    });

    it("propagates API errors", async () => {
        const error = new Error("Unauthorized");

        apiRequestMock.mockRejectedValueOnce(error);

        await expect(loginApi("user", "wrong")).rejects.toThrow("Unauthorized");
    });
});
