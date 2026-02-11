import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import ErrorToast from "@/components/ErrorToast";
import registerService from "@/services/register-service";
import RegisterForm from "@/components/register/RegisterForm";
import type { Account } from "@/types/account";
import {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePersonNumber,
    validateUsername,
    validatePassword,
} from "@/utils/validators";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";

const Register = () => {
    const [formData, setFormData] = useState<Account>({
        firstName: "",
        lastName: "",
        email: "",
        personNumber: "",
        username: "",
        password: "",
    });
    const [touched, setTouched] = useState<Record<keyof Account, boolean>>({
        firstName: false,
        lastName: false,
        email: false,
        personNumber: false,
        username: false,
        password: false,
    });
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Account, string>>>({});
    const [registrationError, setRegistrationError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();

    /* Maps each field to its validator function */
    const fieldValidators: Record<keyof Account, (val: string) => string | null> = {
        firstName: validateFirstName,
        lastName: validateLastName,
        email: validateEmail,
        personNumber: validatePersonNumber,
        username: validateUsername,
        password: validatePassword,
    };

    /* Updates formData and clears any previous error for that field */
    const handleChange = (field: keyof Account, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" })); // clear previous error on change
    };

    /* Called when a field loses focus (onBlur), and marks field as touched and validates it */
    const handleBlur = (field: keyof Account) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const error = fieldValidators[field](formData[field]);
        if (error) setFieldErrors((prev) => ({ ...prev, [field]: error }));
    };

    /* Called when the form is submitted. Validates all fields, sets errors, and attempts login */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields dynamically
        const newErrors: Partial<Record<keyof Account, string>> = {};
        (Object.keys(formData) as (keyof Account)[]).forEach((field) => {
            const error = fieldValidators[field](formData[field]);
            if (error) newErrors[field] = error;
        });

        setFieldErrors(newErrors);
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            personNumber: true,
            username: true,
            password: true,
        });

        if (Object.keys(newErrors).length > 0) return;

        try {
            await registerService.register(formData);
            setSuccess(true);
        } catch (e) {
            setRegistrationError(`${e}`);
        }
    };

    const isFormValid = (Object.keys(formData) as (keyof Account)[]).every(
        (field) => !fieldValidators[field](formData[field]),
    );

    const errorToast = registrationError && (
        <ErrorToast open={true} message={registrationError} onClose={() => setRegistrationError("")} />
    );

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    if (success) {
        return (
            <>
                <Card sx={{ display: "inline-block", p: 2 }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="h3">{t("register.success_title")}</Typography>
                        <Typography variant="body1">{t("register.success_message")}</Typography>
                    </CardContent>
                </Card>
            </>
        );
    }

    return (
        <>
            {errorToast}
            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h1">{t("register.title")}</Typography>
                    <Typography variant="subtitle1">{t("register.subtitle")}</Typography>

                    <RegisterForm
                        data={formData}
                        touched={touched}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        isFormValid={isFormValid}
                    />

                    <Typography variant="subtitle1">
                        <Trans i18nKey="register.have_account" components={{ 1: <Link href="/login" /> }} />
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default Register;
