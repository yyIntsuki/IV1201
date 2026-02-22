import apiRequest from "@/api/client";
import STORAGE_KEYS from "@/constants/storage-keys";

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

/**
 * Unit tests for the apiRequest function, covering successful responses, authorization header inclusion, and error handling.
 *
 * These tests ensure that apiRequest correctly processes successful responses, includes authorization headers when a token is present,
 * and throws appropriate ApiError instances for various error scenarios.
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
        axiosRequestMock.mockResolvedValueOnce({ data: { ok: true } });

        const result = await apiRequest<{ ok: boolean }>("/test");

        expect(result).toEqual({ ok: true });
    });

    /**
     * Adds an Authorization header with the token from localStorage when it exists,
     * ensuring that authenticated requests are properly formed with the necessary credentials.
     */
    it("adds Authorization header when token exists", async () => {
        localStorage.setItem(STORAGE_KEYS.TOKEN, "jwt-token");
        axiosRequestMock.mockResolvedValueOnce({ data: {} });

        await apiRequest("/secure");

        const callArg = axiosRequestMock.mock.calls[0][0] as { headers?: Record<string, string> };

        expect(callArg.headers?.Authorization).toBe("Bearer jwt-token");
    });

    /**
     * Throws an ApiError with the correct properties for HTTP errors, including status and message,
     */
    it("throws ApiError for HTTP errors", async () => {
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
     * Throws an ApiError marked as a network error when the error is an Axios error without a response.
     */
    it("throws network ApiError when no response", async () => {
        axiosRequestMock.mockRejectedValueOnce({ isAxiosError: true, response: undefined });

        await expect(apiRequest("/offline")).rejects.toMatchObject({ name: "ApiError", isNetworkError: true });
    });
});
