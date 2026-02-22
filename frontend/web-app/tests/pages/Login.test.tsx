import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/pages/Login";
import type { LoginData } from "@/types/login";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
    Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const startLoadingMock = vi.fn();
const stopLoadingMock = vi.fn();
vi.mock("@/hooks/use-loading", () => ({
    default: () => ({ startLoading: startLoadingMock, stopLoading: stopLoadingMock }),
}));

const showApiErrorMock = vi.fn();
vi.mock("@/hooks/use-error", () => ({ default: () => ({ showApiError: showApiErrorMock }) }));

const loginMock = vi.fn();
vi.mock("@/hooks/use-auth", () => ({ default: () => ({ login: loginMock }) }));

const fillForm = (data: LoginData) => {
    fireEvent.change(screen.getByLabelText("login.fields.identifier.label"), { target: { value: data.identifier } });
    fireEvent.change(screen.getByLabelText("login.fields.password.label"), { target: { value: data.password } });
};

/**
 * Unit tests for the Login page component.
 *
 * These tests ensure that the Login page correctly orchestrates the underlying hooks, handles user input, submits the form,
 * and displays errors when login fails.
 */
describe("Login page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        loginMock.mockResolvedValue(undefined);
    });

    /**
     * Rendering of all UI elements.
     */
    it("renders LoginForm fields and submit button", () => {
        render(<Login />);

        expect(screen.getByLabelText("login.fields.identifier.label")).toBeInTheDocument();
        expect(screen.getByLabelText("login.fields.password.label")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "login.submit" })).toBeInTheDocument();
    });

    /**
     * Integration with form logic.
     */
    it("calls startLoading, login, stopLoading on successful submit", async () => {
        render(<Login />);

        const formData = { identifier: "user123", password: "password123" };
        fillForm(formData);

        fireEvent.submit(screen.getByRole("button", { name: "login.submit" }));

        await waitFor(() => {
            expect(startLoadingMock).toHaveBeenCalledOnce();
            expect(loginMock).toHaveBeenCalledWith(formData.identifier, formData.password);
            expect(stopLoadingMock).toHaveBeenCalledOnce();
            expect(showApiErrorMock).not.toHaveBeenCalled();
        });
    });

    /**
     * Authentication behavior.
     */
    it("calls showApiError if login fails", async () => {
        const error = new Error("Invalid credentials");
        loginMock.mockRejectedValueOnce(error);

        render(<Login />);

        const formData = { identifier: "user123", password: "password123" };
        fillForm(formData);

        fireEvent.submit(screen.getByRole("button", { name: "login.submit" }));

        await waitFor(() => {
            expect(startLoadingMock).toHaveBeenCalledOnce();
            expect(loginMock).toHaveBeenCalledWith(formData.identifier, formData.password);
            expect(stopLoadingMock).toHaveBeenCalledOnce();
            expect(showApiErrorMock).toHaveBeenCalledWith(error, "login");
        });
    });
});
