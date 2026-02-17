import { useState, useCallback } from "react";

/**
 * Options for the useForm hook.
 *
 * @template T - Shape of the form data (all fields must be strings)
 * @property initialValues - Initial values for each field
 * @property validators - Validation functions per field, returning a string error or null
 * @property onSubmit - Async function called when form is successfully submitted
 */
interface UseFormOptions<T> {
    initialValues: T;
    validators: Record<keyof T, (val: string) => string | null>;
    onSubmit: (data: T) => Promise<void>;
}

/* Helper: validate all fields and return a map of errors.
 * Outside of the useForm hook as it is a purely static helper function.
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

/* Helper: mark all fields as touched
 * Outside of the useForm hook as it is a purely static helper function.
 */
function markAllFieldsTouched<T extends { [K in keyof T]: string }>(data: T): Record<keyof T, boolean> {
    return Object.fromEntries(Object.keys(data).map((k) => [k, true])) as Record<keyof T, boolean>;
}

/**
 * Custom hook for managing form state, validation, and submission.
 *
 * Features:
 * - Tracks form values (`formData`)
 * - Tracks which fields have been touched (`touched`)
 * - Tracks validation errors (`fieldErrors`)
 * - Provides handlers: `handleChange`, `handleBlur`, `handleSubmit`
 * - Computes `isFormValid` dynamically
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
