import { useState, useCallback } from "react";

interface UseFormOptions<T> {
    initialValues: T;
    validators: Record<keyof T, (val: string) => string | null>;
    onSubmit: (data: T) => Promise<void>;
}

const useForm = <T extends { [K in keyof T]: string }>({ initialValues, validators, onSubmit }: UseFormOptions<T>) => {
    const [formData, setFormData] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>(
        Object.fromEntries(Object.keys(initialValues).map(k => [k, false])) as Record<keyof T, boolean>
    );
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof T, string>>>({});

    /* Updates formData and clears any previous error for that field */
    const handleChange = useCallback((field: keyof T, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }, [fieldErrors]);

    /* Called when a field loses focus (onBlur), and marks field as touched and validates it */
    const handleBlur = useCallback((field: keyof T) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validators[field](formData[field]);
        if (error) setFieldErrors(prev => ({ ...prev, [field]: error }));
    }, [formData, validators]);

    /* Validates all fields, sets errors, and attempts form submission. */
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            const newErrors: Partial<Record<keyof T, string>> = {};
            (Object.keys(validators) as (keyof T)[]).forEach((field) => {
                const error = validators[field](formData[field]);
                if (error) newErrors[field] = error;
            });

            setFieldErrors(newErrors);
            setTouched(Object.fromEntries(Object.keys(formData).map((k) => [k, true]),) as Record<keyof T, boolean>);

            if (Object.keys(newErrors).length > 0) return;

            await onSubmit(formData);
        }, [formData, validators, onSubmit]
    );

    const isFormValid = (Object.keys(validators) as (keyof T)[]).every((field) => !validators[field](formData[field]));

    return { formData, touched, fieldErrors, handleChange, handleBlur, handleSubmit, isFormValid };
};

export default useForm;
