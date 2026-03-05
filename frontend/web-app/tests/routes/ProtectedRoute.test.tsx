import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import ProtectedRoute from "@/routes/ProtectedRoute";
import ROUTES from "@/constants/routes";
import type { Role } from "@/types/role";

const useAuthMock = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-auth", () => ({ default: useAuthMock }));

const startLoadingMock = vi.fn();
const stopLoadingMock = vi.fn();
const useLoadingMock = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-loading", () => ({ default: useLoadingMock }));

const showApiErrorMock = vi.fn();
const useErrorMock = vi.hoisted(() => vi.fn());
vi.mock("@/hooks/use-error", () => ({ default: useErrorMock }));

const getUserIdFromJwtMock = vi.hoisted(() => vi.fn());
vi.mock("@/utils/jwt-decoder", () => ({ getUserIdFromJwt: getUserIdFromJwtMock }));

const fetchUserDataApiMock = vi.hoisted(() => vi.fn());
vi.mock("@/api/fetch-user-data-api", () => ({ default: fetchUserDataApiMock }));

/**
 * Unit tests for the ProtectedRoute component with profile validation.
 *
 * Tests cover:
 * - Authentication checks (logged in/out)
 * - Role authorization checks
 * - Profile completeness validation
 * - Redirect flows for incomplete profiles
 */
describe("ProtectedRoute", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useLoadingMock.mockReturnValue({ startLoading: startLoadingMock, stopLoading: stopLoadingMock });
        useErrorMock.mockReturnValue({ showApiError: showApiErrorMock });
    });

    const renderWithRouter = (initialPath = "/protected", allowedRoles?: Role[]) => {
        return render(
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path={ROUTES.LOGIN} element={<div>Login Page</div>} />
                    <Route path={ROUTES.COMPLETE_ACCOUNT} element={<div>Complete Account Page</div>} />
                    <Route path={ROUTES.APPLICANT} element={<div>Applicant Page</div>} />
                    <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );
    };

    /**
     * Authentication: Not logged in
     */
    it("redirects to login when user is not logged in", () => {
        useAuthMock.mockReturnValue({ isLoggedIn: false, role: null, token: null });

        renderWithRouter();

        expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
        expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
    });

    /**
     * Authorization: Wrong role
     */
    it("redirects to user's role page when role not allowed", () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });

        renderWithRouter("/protected", ["recruiter"]);

        expect(screen.getByText(/Applicant Page/i)).toBeInTheDocument();
        expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
    });

    /**
     * Profile validation: Complete profile
     */
    it("renders protected content when user has complete profile", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });
        getUserIdFromJwtMock.mockReturnValue(1);
        fetchUserDataApiMock.mockResolvedValue({
            firstName: "John",
            lastName: "Doe",
            personNumber: "19900101-1234",
            email: "john@example.com",
            username: "johndoe",
            password: "",
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
        });

        expect(fetchUserDataApiMock).toHaveBeenCalledWith(1);
        expect(startLoadingMock).toHaveBeenCalled();
        expect(stopLoadingMock).toHaveBeenCalled();
    });

    /**
     * Profile validation: Incomplete profile - missing firstName
     */
    it("redirects to complete account when firstName is missing", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });
        getUserIdFromJwtMock.mockReturnValue(1);
        fetchUserDataApiMock.mockResolvedValue({
            firstName: "",
            lastName: "Doe",
            personNumber: "19900101-1234",
            email: "john@example.com",
            username: "johndoe",
            password: "",
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Complete Account Page/i)).toBeInTheDocument();
        });

        expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
    });

    /**
     * Profile validation: Incomplete profile - missing email
     */
    it("redirects to complete account when email is missing", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });
        getUserIdFromJwtMock.mockReturnValue(1);
        fetchUserDataApiMock.mockResolvedValue({
            firstName: "John",
            lastName: "Doe",
            personNumber: "19900101-1234",
            email: "",
            username: "johndoe",
            password: "",
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Complete Account Page/i)).toBeInTheDocument();
        });
    });

    /**
     * Profile validation: Incomplete profile - missing username
     */
    it("redirects to complete account when username is missing", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });
        getUserIdFromJwtMock.mockReturnValue(1);
        fetchUserDataApiMock.mockResolvedValue({
            firstName: "John",
            lastName: "Doe",
            personNumber: "19900101-1234",
            email: "john@example.com",
            username: "",
            password: "",
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Complete Account Page/i)).toBeInTheDocument();
        });
    });

    /**
     * Profile validation: Skip check when requireCompleteProfile is false
     */
    it("skips profile check when requireCompleteProfile is false", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route element={<ProtectedRoute requireCompleteProfile={false} />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>,
        );

        await waitFor(() => {
            expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
        });

        expect(fetchUserDataApiMock).not.toHaveBeenCalled();
    });

    /**
     * Error handling: API error during profile check
     */
    it("handles API error during profile check", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "valid-token" });
        getUserIdFromJwtMock.mockReturnValue(1);
        fetchUserDataApiMock.mockRejectedValue(new Error("API Error"));

        renderWithRouter();

        await waitFor(() => {
            expect(showApiErrorMock).toHaveBeenCalledWith(expect.any(Error), "protected-route");
        });

        expect(stopLoadingMock).toHaveBeenCalled();
    });

    /**
     * Edge case: No user ID in token
     */
    it("redirects to complete account when user ID cannot be extracted from token", async () => {
        useAuthMock.mockReturnValue({ isLoggedIn: true, role: "applicant", token: "invalid-token" });
        getUserIdFromJwtMock.mockReturnValue(null);

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Complete Account Page/i)).toBeInTheDocument();
        });

        expect(fetchUserDataApiMock).not.toHaveBeenCalled();
    });
});
