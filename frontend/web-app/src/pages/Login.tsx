import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import useAuth from "@/hooks/use-auth";
import ErrorToast from "@/components/ErrorToast";
import LoginForm from "@/components/login/LoginForm";
import type { LoginData } from "@/types/account";
import formValidator from "@/utils/form-validator";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Login = () => {
    const [formData, setFormData] = useState<LoginData>({ username: "", password: "" });
    const [touched, setTouched] = useState<Record<keyof LoginData, boolean>>({ username: false, password: false });
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginData, string>>>({});
    const [loginError, setLoginError] = useState("");

    const navigate = useNavigate();
    const { t } = useTranslation();
    const validators = formValidator(t);
    const { role, login } = useAuth();

    /* Maps each field to its validator function */
    const fieldValidators: Record<keyof LoginData, (val: string) => string | null> = {
        username: validators.validateUsername,
        password: validators.validatePassword,
    };

    /* Updates formData and clears any previous error for that field */
    const handleChange = (field: "username" | "password", value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    };

    /* Called when a field loses focus (onBlur), and marks field as touched and validates it */
    const handleBlur = (field: "username" | "password") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const error = fieldValidators[field](formData[field]);
        if (error) setFieldErrors((prev) => ({ ...prev, [field]: error }));
    };

    /* Called when the form is submitted. Validates all fields, sets errors, and attempts login */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setTouched({ username: true, password: true });
        setLoginError("");

        // Validate all fields dynamically
        const newErrors: Partial<Record<"username" | "password", string>> = {};
        (Object.keys(fieldValidators) as (keyof typeof fieldValidators)[]).forEach((field) => {
            const error = fieldValidators[field](formData[field]);
            if (error) newErrors[field] = error;
        });

        setFieldErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            await login(formData.username, formData.password);
            navigate(role === "recruiter" ? "/recruiter" : "/applicant", { replace: true });
        } catch {
            setLoginError(t("login.error"));
        }
    };

    const isFormValid = (Object.keys(fieldValidators) as (keyof typeof fieldValidators)[]).every(
        (field) => !fieldValidators[field](formData[field]),
    );

    const errorToast = loginError && <ErrorToast open={true} message={loginError} onClose={() => setLoginError("")} />;

    return (
        <>
            {errorToast}
            <Card sx={{ minWidth: 400, p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h1">{t("login.title")}</Typography>
                    <Typography variant="subtitle1">{t("login.subtitle")}</Typography>

                    <LoginForm
                        data={formData}
                        touched={touched}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        isFormValid={isFormValid}
                    />

                    <Typography variant="subtitle1">
                        <Trans i18nKey="login.no_account" components={{ 1: <Link href="/register" /> }} />
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default Login;
