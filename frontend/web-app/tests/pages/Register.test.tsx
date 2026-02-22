import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Register from "@/pages/Register";
import type { Account } from "@/types/account";

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

const registerMock = vi.hoisted(() => vi.fn());
vi.mock("@/services/register-service", () => ({ default: { register: registerMock } }));

const fillForm = (data: Account) => {
    fireEvent.change(screen.getByLabelText("register.fields.firstName.label"), { target: { value: data.firstName } });
    fireEvent.change(screen.getByLabelText("register.fields.lastName.label"), { target: { value: data.lastName } });
    fireEvent.change(screen.getByLabelText("register.fields.email.label"), { target: { value: data.email } });
    fireEvent.change(screen.getByLabelText("register.fields.personNumber.label"), {
        target: { value: data.personNumber },
    });
    fireEvent.change(screen.getByLabelText("register.fields.username.label"), { target: { value: data.username } });
    fireEvent.change(screen.getByLabelText("register.fields.password.label"), { target: { value: data.password } });
};

/**
 * Unit tests for the Register page component.
 *
 * These tests ensure that the Register page correctly orchestrates the underlying hooks, handles user input,
 * submits the form, shows success messages, and displays errors when registration fails.
 */
describe("Register page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        registerMock.mockResolvedValue(undefined);
    });

    /**
     * Rendering of all UI elements.
     *
     * Ensures that the form renders correctly before any user interaction.
     */
    it("renders RegisterForm fields and submit button", () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>,
        );

        expect(screen.getByLabelText("register.fields.firstName.label")).toBeInTheDocument();
        expect(screen.getByLabelText("register.fields.lastName.label")).toBeInTheDocument();
        expect(screen.getByLabelText("register.fields.email.label")).toBeInTheDocument();
        expect(screen.getByLabelText("register.fields.personNumber.label")).toBeInTheDocument();
        expect(screen.getByLabelText("register.fields.username.label")).toBeInTheDocument();
        expect(screen.getByLabelText("register.fields.password.label")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "register.submit" })).toBeInTheDocument();
    });

    /**
     * Integration with form logic.
     *
     * Loading state behavior, success message display, and service call verification.
     */
    it("calls startLoading, register, stopLoading, and shows success on successful submit", async () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>,
        );

        const formData: Account = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            personNumber: "19900101-1234",
            username: "johndoe",
            password: "password123",
        };
        fillForm(formData);

        fireEvent.submit(screen.getByRole("button", { name: "register.submit" }));

        await waitFor(() => {
            expect(startLoadingMock).toHaveBeenCalledOnce();
            expect(registerMock).toHaveBeenCalledWith(expect.objectContaining(formData));
            expect(stopLoadingMock).toHaveBeenCalledOnce();
            expect(screen.getByText("register.successTitle")).toBeInTheDocument();
        });
    });

    /**
     * Error handling during registration.
     *
     * Ensures that if the register service rejects, the error hook is called and loading state is still stopped.
     */
    it("calls showApiError if registration fails", async () => {
        const error = new Error("Email already exists");
        registerMock.mockRejectedValueOnce(error);

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>,
        );

        const formData: Account = {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            personNumber: "19900101-1234",
            username: "johndoe",
            password: "password123",
        };
        fillForm(formData);

        fireEvent.submit(screen.getByRole("button", { name: "register.submit" }));

        await waitFor(() => {
            expect(startLoadingMock).toHaveBeenCalledOnce();
            expect(registerMock).toHaveBeenCalledWith(expect.objectContaining(formData));
            expect(stopLoadingMock).toHaveBeenCalledOnce();
            expect(showApiErrorMock).toHaveBeenCalledWith(error, "register");
        });
    });
});
