import { describe, it, beforeEach, vi, expect } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AuthProvider from "@/auth/AuthProvider";
import AuthContext from "@/auth/AuthContext";
import authService from "@/services/auth-service";
import { isJwtExpired, getJwtRemainingTime, getRoleFromJwt } from "@/utils/jwt-decoder";
import parseRole from "@/utils/role-parser";

vi.mock("@/services/auth-service", () => ({ default: { login: vi.fn(), logout: vi.fn(), getToken: vi.fn() } }));

vi.mock("@/utils/jwt-decoder", () => ({
    isJwtExpired: vi.fn(),
    getJwtRemainingTime: vi.fn(),
    getRoleFromJwt: vi.fn(),
}));

vi.mock("@/utils/role-parser", () => ({ default: vi.fn() }));

const renderWithProvider = () =>
    render(
        <AuthProvider>
            <AuthContext.Consumer>
                {(value) => (
                    <div>
                        <div data-testid="logged-in">{value?.isLoggedIn ? "true" : "false"}</div>
                        <div data-testid="role">{value?.role ?? "none"}</div>
                        <button onClick={() => void value?.login("user", "pass")}>login</button>
                        <button onClick={() => value?.logout()}>logout</button>
                    </div>
                )}
            </AuthContext.Consumer>
        </AuthProvider>,
    );

/**
 * Unit tests for the AuthProvider component, covering initialization, login, logout, and automatic logout on token expiration.
 *
 * These tests ensure that the AuthProvider correctly manages authentication state based on the presence and validity of JWT tokens,
 * and that it properly updates state in response to login and logout actions.
 */
describe("AuthProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Initializes in logged out state when no token exists.
     */
    it("initializes logged out when no token exists", () => {
        vi.mocked(authService.getToken).mockReturnValue(null);

        renderWithProvider();

        expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
        expect(screen.getByTestId("role")).toHaveTextContent("none");
    });

    /**
     * Initializes in logged out state when token is expired, and removes expired token from storage.
     */
    it("initializes logged in when valid token exists", () => {
        vi.mocked(authService.getToken).mockReturnValue("token");
        vi.mocked(isJwtExpired).mockReturnValue(false);
        vi.mocked(getRoleFromJwt).mockReturnValue(2);
        vi.mocked(parseRole).mockReturnValue("applicant");

        act(() => {
            renderWithProvider();
        });

        expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
        expect(screen.getByTestId("role")).toHaveTextContent("applicant");
    });

    /**
     * Login updates authentication state, calls authService.login, and reflects logged in status and role in context.
     */
    it("login updates authentication state", async () => {
        vi.mocked(authService.getToken).mockReturnValueOnce(null).mockReturnValueOnce("token");
        vi.mocked(isJwtExpired).mockReturnValue(false);
        vi.mocked(getRoleFromJwt).mockReturnValue(1);
        vi.mocked(parseRole).mockReturnValue("applicant");
        vi.mocked(authService.login).mockResolvedValue(undefined);

        renderWithProvider();

        act(() => {
            fireEvent.click(screen.getByText("login"));
        });

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith("user", "pass");
            expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
            expect(screen.getByTestId("role")).toHaveTextContent("applicant");
        });
    });

    /**
     * Logout clears authentication state, calls authService.logout, and reflects logged out status and no role in context.
     */
    it("logout clears authentication state", () => {
        vi.mocked(authService.getToken).mockReturnValue("token");
        vi.mocked(isJwtExpired).mockReturnValue(false);
        vi.mocked(getRoleFromJwt).mockReturnValue(1);
        vi.mocked(parseRole).mockReturnValue("applicant");
        vi.mocked(authService.logout).mockReturnValue(undefined);

        renderWithProvider();

        act(() => {
            fireEvent.click(screen.getByText("logout"));
        });

        expect(authService.logout).toHaveBeenCalled();
        expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
        expect(screen.getByTestId("role")).toHaveTextContent("none");
    });

    /**
     * Automatically logs out the user when the token expires by checking remaining time and calling logout when it reaches zero.
     */
    it("automatically logs out when token expires", () => {
        vi.useFakeTimers();
        vi.mocked(authService.getToken).mockReturnValue("token");
        vi.mocked(isJwtExpired).mockReturnValue(false);
        vi.mocked(getJwtRemainingTime).mockReturnValue(0);
        vi.mocked(authService.logout).mockReturnValue(undefined);

        act(() => {
            renderWithProvider();
        });

        act(() => {
            vi.advanceTimersByTime(0);
        });

        expect(authService.logout).toHaveBeenCalled();
        expect(screen.getByTestId("logged-in")).toHaveTextContent("false");

        vi.useRealTimers();
    });
});
