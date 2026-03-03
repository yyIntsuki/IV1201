import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import CompleteAccount from "@/pages/CompleteAccount";
import type { Account } from "@/types/account";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const startLoadingMock = vi.fn();
const stopLoadingMock = vi.fn();
vi.mock("@/hooks/use-loading", () => ({
    default: () => ({ startLoading: startLoadingMock, stopLoading: stopLoadingMock }),
}));

const showApiErrorMock = vi.fn();
const showErrorMock = vi.fn();
vi.mock("@/hooks/use-error", () => ({ default: () => ({ showApiError: showApiErrorMock, showError: showErrorMock }) }));

const navigateMock = vi.fn();
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return { ...actual, useNavigate: () => navigateMock };
});

const roleMock = "applicant";
vi.mock("@/hooks/use-auth", () => ({ default: () => ({ role: roleMock }) }));

const verifyTokenMock = vi.hoisted(() => vi.fn());
const completeAccountMock = vi.hoisted(() => vi.fn());
const clearSessionMock = vi.hoisted(() => vi.fn());
vi.mock("@/services/complete-account-service", () => ({
    default: { verifyToken: verifyTokenMock, completeAccount: completeAccountMock, clearSession: clearSessionMock },
}));

vi.mock("@/utils/form-validator", () => ({
    default: () => ({
        validateFirstName: () => null,
        validateLastName: () => null,
        validateEmail: () => null,
        validatePersonNumber: () => null,
        validateUsername: () => null,
        validatePassword: () => null,
    }),
}));

const renderWithRouter = (token?: string) => {
    const path = token ? `/complete-account?token=${token}` : "/complete-account";
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="/complete-account" element={<CompleteAccount />} />
            </Routes>
        </MemoryRouter>,
    );
};

/**
 * Unit tests for the CompleteAccount page component.
 *
 * These tests ensure that the CompleteAccount page correctly verifies tokens, handles account data,
 * identifies read-only fields, submits only editable fields, and handles errors appropriately.
 */
describe("CompleteAccount page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        verifyTokenMock.mockResolvedValue({
            firstName: "",
            lastName: "",
            email: "user@example.com",
            personNumber: "19900101-1234",
            username: "",
            password: "",
        });
        completeAccountMock.mockResolvedValue(undefined);
    });

    /**
     * Token verification and rendering.
     */
    it("calls showError when no token is provided", async () => {
        renderWithRouter();

        await waitFor(() => {
            expect(showErrorMock).toHaveBeenCalledWith("completion.errors.noToken");
        });
    });

    it("verifies token and displays form with account data", async () => {
        renderWithRouter("valid-token");

        await waitFor(() => {
            expect(verifyTokenMock).toHaveBeenCalledWith("valid-token");
            expect(screen.getByText("completion.title")).toBeInTheDocument();
        });

        expect(startLoadingMock).toHaveBeenCalled();
        expect(stopLoadingMock).toHaveBeenCalled();
    });

    /**
     * Read-only field identification.
     */
    it("displays info alert when there are pre-filled fields", async () => {
        verifyTokenMock.mockResolvedValue({
            firstName: "",
            lastName: "",
            email: "user@example.com",
            personNumber: "19900101-1234",
            username: "",
            password: "",
        });

        renderWithRouter("valid-token");

        await waitFor(() => {
            expect(screen.getByText("completion.prefilledInfo")).toBeInTheDocument();
        });
    });

    it("does not show info alert when no fields are pre-filled", async () => {
        verifyTokenMock.mockResolvedValue({
            firstName: "",
            lastName: "",
            email: "",
            personNumber: "",
            username: "",
            password: "",
        });

        renderWithRouter("valid-token");

        await waitFor(() => {
            expect(screen.getByText("completion.title")).toBeInTheDocument();
        });

        expect(screen.queryByText("completion.prefilledInfo")).not.toBeInTheDocument();
    });

    /**
     * Form submission - the most critical test.
     */
    it("submits only non-read-only fields on form submission", async () => {
        verifyTokenMock.mockResolvedValue({
            firstName: "",
            lastName: "",
            email: "user@example.com",
            personNumber: "19900101-1234",
            username: "",
            password: "",
        });

        renderWithRouter("valid-token");

        await waitFor(() => screen.getByText("completion.title"));

        const submitButton = screen.getByRole("button", { name: "completion.submit" });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(completeAccountMock).toHaveBeenCalled();
        });

        const submittedData = completeAccountMock.mock.calls[0][0] as Account;
        expect(submittedData).not.toHaveProperty("email");
        expect(submittedData).not.toHaveProperty("personNumber");

        expect(submittedData).toHaveProperty("firstName");
        expect(submittedData).toHaveProperty("lastName");
        expect(submittedData).toHaveProperty("username");
        expect(submittedData).toHaveProperty("password");
    });

    it("shows success message after successful completion", async () => {
        renderWithRouter("valid-token");

        await waitFor(() => screen.getByText("completion.title"));

        const submitButton = screen.getByRole("button", { name: "completion.submit" });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText("completion.successTitle")).toBeInTheDocument();
            expect(screen.getByText("completion.successMessage")).toBeInTheDocument();
        });

        expect(completeAccountMock).toHaveBeenCalled();
        expect(startLoadingMock).toHaveBeenCalled();
        expect(stopLoadingMock).toHaveBeenCalled();
    });

    /**
     * Error handling.
     */
    it("shows error when token verification fails", async () => {
        const error = new Error("Invalid token");
        verifyTokenMock.mockRejectedValue(error);

        renderWithRouter("invalid-token");

        await waitFor(() => {
            expect(showApiErrorMock).toHaveBeenCalledWith(error, "completion");
        });
    });

    it("shows error when form submission fails", async () => {
        const error = new Error("Username already exists");
        completeAccountMock.mockRejectedValue(error);

        renderWithRouter("valid-token");

        await waitFor(() => screen.getByText("completion.title"));

        const submitButton = screen.getByRole("button", { name: "completion.submit" });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(showApiErrorMock).toHaveBeenCalledWith(error, "register");
            expect(startLoadingMock).toHaveBeenCalled();
            expect(stopLoadingMock).toHaveBeenCalled();
        });

        expect(screen.queryByText("completion.successTitle")).not.toBeInTheDocument();
    });

    /**
     * Cleanup.
     */
    it("clears session on unmount", async () => {
        const { unmount } = renderWithRouter("valid-token");

        await waitFor(() => screen.getByText("completion.title"));

        unmount();

        expect(clearSessionMock).toHaveBeenCalled();
    });
});
