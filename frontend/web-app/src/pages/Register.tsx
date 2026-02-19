import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation, Trans } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import useForm from "@/hooks/use-form";
import ROUTES from "@/constants/routes";
import type { Account } from "@/types/account";
import registerService from "@/services/register-service";
import formValidator from "@/utils/form-validator";
import RegisterForm from "@/components/register/RegisterForm";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router";

const Register = () => {
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError } = useError();

    const validator = formValidator(t);
    const { formData, touched, fieldErrors, handleChange, handleBlur, handleSubmit, isFormValid } = useForm<Account>({
        initialValues: { firstName: "", lastName: "", email: "", personNumber: "", username: "", password: "" },
        validators: {
            firstName: validator.validateFirstName,
            lastName: validator.validateLastName,
            email: validator.validateEmail,
            personNumber: validator.validatePersonNumber,
            username: validator.validateUsername,
            password: validator.validatePassword,
        },
        onSubmit: async (data) => {
            try {
                startLoading();
                await registerService.register(data);
                setSuccess(true);
            } catch (error) {
                showApiError(error, "register");
            } finally {
                stopLoading();
            }
        },
    });

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    if (success) {
        return (
            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h3">{t("register.successTitle")}</Typography>
                    <Typography variant="body1">{t("register.successMessage")}</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
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
                    <Trans
                        i18nKey="register.haveAccount"
                        components={{ 1: <Link component={RouterLink} to="/login" /> }}
                    />
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Register;
