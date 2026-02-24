import apiRequest from "@/api/client";

const axiosRequestMock = vi.hoisted(() => vi.fn());
vi.mock("axios", () => {
    return {
        __esModule: true, // Necessary to properly mock an ES module
        default: {
            create: vi.fn(() => axiosRequestMock),
            isAxiosError: (error: unknown): boolean =>
                typeof error === "object" &&
                error !== null &&
                (error as { isAxiosError?: boolean }).isAxiosError === true,
        },
    };
});

const getTokenMock = vi.hoisted(() => vi.fn<() => string | null>());
vi.mock("@/services/auth-service", () => ({ default: { getToken: getTokenMock } }));

/**
 * Unit tests for the apiRequest function, covering successful responses, authorization header
 * inclusion, and error handling.
 *
 * These tests ensure that apiRequest correctly processes successful responses, includes authorization
 * headers when a token is present, and throws appropriate ApiError instances for all error scenarios,
 * including the detail/message field priority, network errors, and non-Axios errors.
 */
describe("apiRequest", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    /**
     * Returns response.data on successful API calls,
     * ensuring that the function correctly extracts and returns the expected data from the response.
     */
    it("returns response.data on success", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockResolvedValueOnce({ data: { ok: true } });

        const result = await apiRequest<{ ok: boolean }>("/test");

        expect(result).toEqual({ ok: true });
    });

    /**
     * Adds an Authorization header with the token from localStorage when it exists,
     * ensuring that authenticated requests are properly formed with the necessary credentials.
     */
    it("adds Authorization header when authService returns a token", async () => {
        getTokenMock.mockReturnValue("jwt-token");
        axiosRequestMock.mockResolvedValueOnce({ data: {} });

        await apiRequest("/secure");

        const callArg = axiosRequestMock.mock.calls[0][0] as { headers?: Record<string, string> };

        expect(callArg.headers?.Authorization).toBe("Bearer jwt-token");
    });

    /**
     * Omits the Authorization header when no token is present in localStorage,
     * ensuring that unauthenticated requests do not send a malformed header.
     */
    it("omits Authorization header when authService returns null", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockResolvedValueOnce({ data: {} });

        await apiRequest("/public");

        const callArg = axiosRequestMock.mock.calls[0][0] as { headers?: Record<string, string> };
        expect(callArg.headers?.Authorization).toBeUndefined();
    });

    /**
     * Falls back to the `message` field when `detail` is absent,
     * ensuring compatibility with non-FastAPI error response shapes.
     */
    it("throws ApiError using detail field when present", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 422, data: { detail: "Validation failed" } },
        });

        await expect(apiRequest("/fail")).rejects.toMatchObject({
            name: "ApiError",
            status: 422,
            message: "Validation failed",
            isNetworkError: false,
        });
    });

    /**
     * Falls back to a generic "HTTP error <status>" message when neither `detail` nor `message`
     * is present in the response body.
     */
    it("throws ApiError using message field when detail is absent", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 401, data: { message: "Unauthorized" } },
        });

        await expect(apiRequest("/fail")).rejects.toMatchObject({
            name: "ApiError",
            status: 401,
            message: "Unauthorized",
            isNetworkError: false,
        });
    });

    /**
     * Falls back to a generic "HTTP error <status>" message when neither `detail` nor `message`
     * is present in the response body.
     */
    it("throws ApiError with generic HTTP error message when body has no message fields", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockRejectedValueOnce({ isAxiosError: true, response: { status: 500, data: {} } });

        await expect(apiRequest("/fail")).rejects.toMatchObject({
            name: "ApiError",
            status: 500,
            message: "HTTP error 500",
            isNetworkError: false,
        });
    });

    /**
     * Throws an ApiError marked as a network error when the Axios error has no response object,
     * indicating the request never reached the server.
     */
    it("throws network ApiError when no response", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockRejectedValueOnce({ isAxiosError: true, response: undefined });

        await expect(apiRequest("/offline")).rejects.toMatchObject({ name: "ApiError", isNetworkError: true });
    });

    /**
     * Throws an ApiError for non-Axios errors (e.g. unexpected thrown values),
     * ensuring the catch block's fallback path is covered and nothing escapes unhandled.
     */
    it("throws ApiError with isNetworkError true for non-Axios errors", async () => {
        getTokenMock.mockReturnValue(null);
        axiosRequestMock.mockRejectedValueOnce(new Error("Unexpected failure"));

        await expect(apiRequest("/crash")).rejects.toMatchObject({
            name: "ApiError",
            message: "Unexpected error",
            isNetworkError: true,
        });
    });
});
