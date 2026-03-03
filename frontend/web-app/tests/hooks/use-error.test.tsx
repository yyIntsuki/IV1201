import { renderHook, act } from "@testing-library/react";
import useError from "@/hooks/use-error";
import ErrorContext from "@/errors/ErrorContext";
import { createApiError, type ApiError } from "@/api/api-error";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const createWrapper =
    (showError: (msg: string) => void) =>
    ({ children }: { children: React.ReactNode }) => (
        <ErrorContext.Provider value={{ showError }}>{children}</ErrorContext.Provider>
    );

/**
 * Unit tests for the useError hook, covering error message retrieval and display functionality.
 *
 * These tests ensure that useError correctly identifies different types of API errors and returns appropriate messages,
 * and that it properly calls the context's showError function when requested.
 */
describe("useError hook", () => {
    const mockShowError = vi.fn() as (msg: string) => void;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Throws if useError is used outside of an ErrorProvider,
     * ensuring that the hook is properly used within the expected context.
     */
    it("throws if used outside ErrorProvider", () => {
        expect(() => renderHook(() => useError())).toThrow("useError must be used within an ErrorProvider");
    });

    /**
     * Returns a network error message for ApiErrors marked as network errors,
     * ensuring that network issues are correctly identified and messaged.
     */
    it("getApiErrorMessage returns network error message", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const error: ApiError = createApiError("Network error", { isNetworkError: true });
        expect(result.current.getApiErrorMessage(error)).toBe("errors.network");
    });

    /**
     * Returns specific messages for registration errors based on status code and scope,
     * ensuring that common registration issues are clearly communicated to the user.
     */
    it("returns registration email/username/pnr errors for 400 + register scope", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const emailError: ApiError = createApiError("Email already exists", { status: 400 });
        const usernameError: ApiError = createApiError("Username taken", { status: 400 });
        const pnrError: ApiError = createApiError("Personal number exists", { status: 400 });

        expect(result.current.getApiErrorMessage(emailError, "register")).toBe("errors.registration.emailExists");
        expect(result.current.getApiErrorMessage(usernameError, "register")).toBe("errors.registration.usernameExists");
        expect(result.current.getApiErrorMessage(pnrError, "register")).toBe("errors.registration.pnrExists");
    });

    /**
     * Returns the same registration error messages for completion scope,
     * since completion and registration use identical validation rules.
     */
    it("returns registration errors for completion scope (reuses same messages)", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const usernameError: ApiError = createApiError("Username taken", { status: 400 });

        // Completion scope uses the same error keys as registration
        expect(result.current.getApiErrorMessage(usernameError, "completion")).toBe(
            "errors.registration.usernameExists",
        );
    });

    /**
     * Returns validation error messages for invalid data format,
     * ensuring field-specific validation errors are identified correctly.
     */
    it("returns validation errors for invalid field formats", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const nameError: ApiError = createApiError("Name contains invalid characters", { status: 400 });
        const usernameError: ApiError = createApiError("Username too short", { status: 400 });
        const emailError: ApiError = createApiError("Email format invalid", { status: 400 });

        expect(result.current.getApiErrorMessage(nameError, "register")).toBe("errors.registration.invalidName");
        expect(result.current.getApiErrorMessage(usernameError, "register")).toBe(
            "errors.registration.invalidUsername",
        );
        expect(result.current.getApiErrorMessage(emailError, "register")).toBe("errors.registration.invalidEmail");
    });

    /**
     * Returns correct message for 401 errors based on scope,
     * ensuring that authentication issues are clearly communicated to the user.
     */
    it("returns correct message for 401 errors", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const loginError: ApiError = createApiError("Unauthorized", { status: 401 });
        const otherError: ApiError = createApiError("Unauthorized", { status: 401 });

        expect(result.current.getApiErrorMessage(loginError, "login")).toBe("errors.login.authentication");
        expect(result.current.getApiErrorMessage(otherError, "other")).toBe("errors.unauthorized");
    });

    /**
     * Returns a generic server error message for 500+ status codes,
     * ensuring that server issues are communicated without exposing unnecessary details.
     */
    it("returns server message for 500+ errors", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const error500: ApiError = createApiError("Server error", { status: 500 });
        const error503: ApiError = createApiError("Service unavailable", { status: 503 });

        expect(result.current.getApiErrorMessage(error500)).toBe("errors.server");
        expect(result.current.getApiErrorMessage(error503)).toBe("errors.server");
    });

    /**
     * Returns the error's message property for normal Error objects,
     * ensuring that non-API errors are still communicated effectively to the user.
     */
    it("returns error.message if passed a normal Error", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const normalError = new Error("Custom error");
        expect(result.current.getApiErrorMessage(normalError)).toBe("Custom error");
    });

    /**
     * Returns a generic server error message for unknown error objects,
     * ensuring that unexpected error types do not cause issues and still provide feedback to the user.
     */
    it("returns server message for unknown objects", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const unknownError: unknown = { foo: "bar" };
        expect(result.current.getApiErrorMessage(unknownError)).toBe("errors.server");
    });

    /**
     * Calls context.showError with the correct message when showApiError is called,
     * ensuring that API errors are properly displayed to the user through the context mechanism.
     */
    it("showApiError calls context.showError with correct message", () => {
        const { result } = renderHook(() => useError(), { wrapper: createWrapper(mockShowError) });

        const apiError: ApiError = createApiError("Internal server error", { status: 500 });
        const normalError = new Error("Something went wrong");

        act(() => {
            result.current.showApiError(apiError);
        });
        expect(mockShowError).toHaveBeenCalledWith("errors.server");

        act(() => {
            result.current.showApiError(normalError);
        });
        expect(mockShowError).toHaveBeenCalledWith("Something went wrong");
    });
});
