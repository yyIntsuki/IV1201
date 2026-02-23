import { useState, useCallback } from "react";

interface UseFormOptions<T> {
    initialValues: T;
    validators: Record<keyof T, (val: string) => string | null>;
    onSubmit: (data: T) => Promise<void>;
}

/**
 * Validates all fields of a given form data using provided validators.
 * Returns an object with field names as keys and validation errors as values.
 * If a field has no validation error, it will not be present in the returned object.
 * @param data - The form data to validate.
 * @param validators - The validators to use when validating the form data.
 * @returns An object with field names as keys and validation errors as values.
 */
function validateAllFields<T extends { [K in keyof T]: string }>(
    data: T,
    validators: Record<keyof T, (val: string) => string | null>,
) {
    const errors: Partial<Record<keyof T, string>> = {};
    (Object.keys(validators) as (keyof T)[]).forEach((field) => {
        const error = validators[field](data[field]);
        if (error) errors[field] = error;
    });
    return errors;
}

/**
 * Marks all fields of a given form data as touched.
 * Returns an object with field names as keys and boolean values indicating whether the field has been touched.
 * @param data - The form data to mark as touched.
 * @returns An object with field names as keys and boolean values indicating whether the field has been touched.
 */
function markAllFieldsTouched<T extends { [K in keyof T]: string }>(data: T): Record<keyof T, boolean> {
    return Object.fromEntries(Object.keys(data).map((k) => [k, true])) as Record<keyof T, boolean>;
}

/**
 * A React hook that manages form state, validation, and submission.
 *
 * useForm provides several utilities to manage form state and validation:
 * - formData: The current form data.
 * - touched: A boolean object tracking which fields have been touched (blurred).
 * - fieldErrors: A string object tracking validation errors for each field.
 * - handleChange: A function that updates the value of a field and clears its previous error.
 * - handleBlur: A function that marks a field as touched and validates it immediately.
 * - handleSubmit: A function that validates all fields and submits the form if valid.
 * - isFormValid: A boolean indicating whether all fields are currently valid (no errors).
 *
 * @example
 * const { formData, touched, fieldErrors, handleChange, handleSubmit } = useForm({
 *     initialValues: { email: "", password: "" },
 *     validators: {
 *         email: (val) => val.includes("@") ? null : "Email must contain @",
 *         password: (val) => val.length >= 8 ? null : "Password must be at least 8 characters",
 *     },
 *     onSubmit: async (data) => {
 *         // Submit form data to server
 *     },
 * });
 *
 * @param initialValues - The initial values of the form data.
 * @param validators - An object containing functions to validate each field of the form data.
 * @param onSubmit - An async function called when the form is submitted with valid data.
 * @returns An object containing utilities to manage form state and validation.
 */
const useForm = <T extends { [K in keyof T]: string }>({ initialValues, validators, onSubmit }: UseFormOptions<T>) => {
    const [formData, setFormData] = useState<T>(initialValues);

    /* Tracks which fields have been touched (blurred) */
    const [touched, setTouched] = useState<Record<keyof T, boolean>>(
        Object.fromEntries(Object.keys(initialValues).map((k) => [k, false])) as Record<keyof T, boolean>,
    );

    /* Tracks validation errors for each field */
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string>>>({});

    /**
     * Updates the value of a field and clears its previous error.
     */
    const handleChange = useCallback(
        (field: keyof T, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));

            // Clear previous error for this field as user edits it
            if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        },
        [fieldErrors],
    );

    /**
     * Marks a field as touched and validates it immediately.
     */
    const handleBlur = useCallback(
        (field: keyof T) => {
            setTouched((prev) => ({ ...prev, [field]: true }));

            const error = validators[field](formData[field]);
            if (error) setFieldErrors((prev) => ({ ...prev, [field]: error }));
        },
        [formData, validators],
    );

    /**
     * Validates all fields and submits the form if valid.
     * Marks all fields as touched so errors are visible.
     */
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            const newErrors = validateAllFields(formData, validators);
            setFieldErrors(newErrors);

            // Mark all fields as touched to show errors
            setTouched(markAllFieldsTouched(formData));

            // Stop submission if there are validation errors
            if (Object.keys(newErrors).length > 0) return;

            // Call the async onSubmit callback provided by the user
            await onSubmit(formData);
        },
        [formData, validators, onSubmit],
    );

    /**
     * Whether all fields are currently valid (no errors).
     */
    const isFormValid = Object.keys(validators).every(
        (field) => !validators[field as keyof T](formData[field as keyof T]),
    );

    return { formData, touched, fieldErrors, handleChange, handleBlur, handleSubmit, isFormValid };
};

export default useForm;
