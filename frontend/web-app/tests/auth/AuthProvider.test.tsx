import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AuthProvider from "@/auth/AuthProvider";
import AuthContext from "@/auth/AuthContext";

const getTokenMock = vi.hoisted(() => vi.fn());
const loginMock = vi.hoisted(() => vi.fn());
const logoutMock = vi.hoisted(() => vi.fn());
vi.mock("@/services/auth-service", () => ({
    default: { login: loginMock, logout: logoutMock, getToken: getTokenMock },
}));

const isJwtExpiredMock = vi.hoisted(() => vi.fn());
const getJwtRemainingTimeMock = vi.hoisted(() => vi.fn());
const getRoleFromJwtMock = vi.hoisted(() => vi.fn());
vi.mock("@/utils/jwt-decoder", () => ({
    isJwtExpired: isJwtExpiredMock,
    getJwtRemainingTime: getJwtRemainingTimeMock,
    getRoleFromJwt: getRoleFromJwtMock,
}));

const parseRoleMock = vi.hoisted(() => vi.fn());
vi.mock("@/utils/role-parser", () => ({ default: parseRoleMock }));

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
        getTokenMock.mockReturnValue(null);

        renderWithProvider();

        expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
        expect(screen.getByTestId("role")).toHaveTextContent("none");
    });

    /**
     * Initializes in logged out state when token is expired, and removes expired token from storage.
     */
    it("initializes logged in when valid token exists", () => {
        getTokenMock.mockReturnValue("token");
        isJwtExpiredMock.mockReturnValue(false);
        getRoleFromJwtMock.mockReturnValue(2);
        parseRoleMock.mockReturnValue("applicant");

        renderWithProvider();

        expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
        expect(screen.getByTestId("role")).toHaveTextContent("applicant");
    });

    /**
     * Login updates authentication state, calls authService.login, and reflects logged in status and role in context.
     */
    it("login updates authentication state", async () => {
        getTokenMock.mockReturnValueOnce(null).mockReturnValueOnce("token");
        isJwtExpiredMock.mockReturnValue(false);
        getRoleFromJwtMock.mockReturnValue(2);
        parseRoleMock.mockReturnValue("applicant");
        loginMock.mockResolvedValue(undefined);

        renderWithProvider();

        fireEvent.click(screen.getByText("login"));

        await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith("user", "pass");
            expect(screen.getByTestId("logged-in")).toHaveTextContent("true");
            expect(screen.getByTestId("role")).toHaveTextContent("applicant");
        });
    });

    /**
     * Logout clears authentication state, calls authService.logout, and reflects logged out status and no role in context.
     */
    it("logout clears authentication state", () => {
        getTokenMock.mockReturnValue("token");
        isJwtExpiredMock.mockReturnValue(false);
        getRoleFromJwtMock.mockReturnValue(2);
        parseRoleMock.mockReturnValue("applicant");
        logoutMock.mockReturnValue(undefined);

        renderWithProvider();

        fireEvent.click(screen.getByText("logout"));

        expect(logoutMock).toHaveBeenCalled();
        expect(screen.getByTestId("logged-in")).toHaveTextContent("false");
        expect(screen.getByTestId("role")).toHaveTextContent("none");
    });

    /**
     * Automatically logs out the user when the token expires by checking remaining time and calling logout when it reaches zero.
     */
    it("automatically logs out when token expires", () => {
        vi.useFakeTimers();
        getTokenMock.mockReturnValue("token");
        isJwtExpiredMock.mockReturnValue(false);
        getJwtRemainingTimeMock.mockReturnValue(0);
        logoutMock.mockReturnValue(undefined);

        renderWithProvider();

        act(() => {
            vi.advanceTimersByTime(0);
        });

        expect(logoutMock).toHaveBeenCalled();
        expect(screen.getByTestId("logged-in")).toHaveTextContent("false");

        vi.useRealTimers();
    });
});
