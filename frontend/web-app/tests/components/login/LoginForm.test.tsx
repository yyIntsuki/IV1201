/**
 * Unit tests for the LoginForm component.
 *
 * These tests ensure that the LoginForm component correctly reflects the props provided by
 * the parent page and triggers the proper callbacks.
 */

import { describe, it, expect, vi, beforeEach, type MockedFunction } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "@/components/login/LoginForm";
import type { LoginData } from "@/types/login";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

type UseLoadingReturn = { loading: boolean; startLoading: () => void; stopLoading: () => void };

const mockUseLoading: MockedFunction<() => UseLoadingReturn> = vi.fn();

vi.mock("@/hooks/use-loading", () => ({ default: () => mockUseLoading() }));

const baseProps = {
    data: { identifier: "", password: "" } as LoginData,
    touched: { identifier: false, password: false },
    fieldErrors: {},
    handleChange: vi.fn(),
    handleBlur: vi.fn(),
    handleSubmit: vi.fn(),
    isFormValid: false,
};

describe("LoginForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockUseLoading.mockReturnValue({ loading: false, startLoading: vi.fn(), stopLoading: vi.fn() });
    });

    /**
     * Rendering of identifier and password fields.
     */
    it("renders identifier and password fields", () => {
        render(<LoginForm {...baseProps} />);

        expect(screen.getByLabelText("login.fields.identifier.label")).toBeInTheDocument();
        expect(screen.getByLabelText("login.fields.password.label")).toBeInTheDocument();
    });

    /**
     * Proper calling of handlers:
     *  - handleChange when typing
     *  - handleBlur when leaving a field
     *  - handleSubmit when submitting the form
     */
    it("calls handleChange when typing", () => {
        render(<LoginForm {...baseProps} />);

        fireEvent.change(screen.getByLabelText("login.fields.identifier.label"), { target: { value: "user123" } });

        expect(baseProps.handleChange).toHaveBeenCalledWith("identifier", "user123");
    });

    it("calls handleBlur on blur", () => {
        render(<LoginForm {...baseProps} />);

        fireEvent.blur(screen.getByLabelText("login.fields.identifier.label"));

        expect(baseProps.handleBlur).toHaveBeenCalledWith("identifier");
    });

    it("calls handleSubmit on form submit", () => {
        render(<LoginForm {...baseProps} isFormValid={true} />);

        fireEvent.submit(screen.getByRole("button", { name: "login.submit" }));

        expect(baseProps.handleSubmit).toHaveBeenCalled();
    });

    /**
     * Validation display:
     *  - Shows validation errors only for touched fields
     *  - Does not show errors for untouched fields
     */
    it("shows validation error when field is touched", () => {
        render(
            <LoginForm
                {...baseProps}
                touched={{ identifier: true, password: false }}
                fieldErrors={{ identifier: "required" }}
            />,
        );

        expect(screen.getByText("required")).toBeInTheDocument();
    });

    it("does not show validation error when field is not touched", () => {
        render(
            <LoginForm
                {...baseProps}
                touched={{ identifier: false, password: false }}
                fieldErrors={{ identifier: "required" }}
            />,
        );

        expect(screen.queryByText("required")).not.toBeInTheDocument();
    });

    /**
     * Button behavior:
     *  - Disabled when form is invalid
     *  - Disabled while loading
     */
    it("disables submit button when form is invalid", () => {
        render(<LoginForm {...baseProps} isFormValid={false} />);

        expect(screen.getByRole("button", { name: "login.submit" })).toBeDisabled();
    });

    it("disables submit button when loading", () => {
        mockUseLoading.mockReturnValue({ loading: true, startLoading: vi.fn(), stopLoading: vi.fn() });

        render(<LoginForm {...baseProps} isFormValid={true} />);

        expect(screen.getByRole("button", { name: "login.submit" })).toBeDisabled();
    });
});
