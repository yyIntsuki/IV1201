import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useForm from "@/hooks/use-form";

/**
 * Unit tests for the useForm custom hook.
 *
 * These tests ensure that the useForm hook behaves correctly for form state management, validation, and submission.
 */
describe("useForm", () => {
    const initialValues = { email: "", password: "" };

    const validators = {
        email: (v: string) => (!v ? "email required" : null),
        password: (v: string) => (v.length < 8 ? "password too short" : null),
    };

    /**
     * Initialization of form state (formData, touched, fieldErrors).
     */
    it("initializes form state correctly", () => {
        const { result } = renderHook(() => useForm({ initialValues, validators, onSubmit: vi.fn() }));

        expect(result.current.formData).toEqual(initialValues);
        expect(result.current.touched).toEqual({ email: false, password: false });
        expect(result.current.fieldErrors).toEqual({});
        expect(result.current.isFormValid).toBe(false);
    });

    /**
     * handleChange updates form data.
     */
    it("updates field value on handleChange", () => {
        const { result } = renderHook(() => useForm({ initialValues, validators, onSubmit: vi.fn() }));

        act(() => {
            result.current.handleChange("email", "test@example.com");
        });

        expect(result.current.formData.email).toBe("test@example.com");
    });

    /**
     * handleBlur marks fields as touched and validates.
     */
    it("marks field as touched and sets error on blur", () => {
        const { result } = renderHook(() => useForm({ initialValues, validators, onSubmit: vi.fn() }));

        act(() => {
            result.current.handleBlur("email");
        });

        expect(result.current.touched.email).toBe(true);
        expect(result.current.fieldErrors.email).toBe("email required");
    });

    /**
     * handleSubmit:
     *  - Prevents submission when form is invalid
     *  - Calls onSubmit with form data when form is valid
     */
    it("does not call onSubmit when form is invalid", async () => {
        const onSubmit = vi.fn();

        const { result } = renderHook(() => useForm({ initialValues, validators, onSubmit }));

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });

        expect(onSubmit).not.toHaveBeenCalled();
        expect(result.current.touched).toEqual({ email: true, password: true });
    });

    it("calls onSubmit with form data when form is valid", async () => {
        const onSubmit = vi.fn();

        const { result } = renderHook(() => useForm({ initialValues, validators, onSubmit }));

        act(() => {
            result.current.handleChange("email", "test@example.com");
            result.current.handleChange("password", "12345678");
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: vi.fn() } as unknown as React.FormEvent);
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith({ email: "test@example.com", password: "12345678" });
    });
});
