import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import useAuth from "@/hooks/use-auth";
import useForm from "@/hooks/use-form";
import ROUTES from "@/constants/routes";
import type { LoginData, PasswordResetData } from "@/types/login";
import authService from "@/services/auth-service";
import formValidator from "@/utils/form-validator";
import LoginForm from "@/components/login/LoginForm";
import PasswordResetForm from "@/components/login/PasswordResetForm";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

/**
 * Component that handles user login in the login page.
 * Uses the useForm hook to manage the form state and validation, and the useLoading and useError hooks to handle loading and error states.
 * When the form is submitted successfully, it logs the user in and navigates them to the home page after a short delay.
 * If the form submission fails, it shows an API error message.
 */
const Login = () => {
    const [mode, setMode] = useState<"login" | "password-reset">("login");
    const [accessRequested, setAccessRequested] = useState(false);

    const { t } = useTranslation();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError } = useError();
    const { login } = useAuth();

    const validators = formValidator(t);

    const loginForm = useForm<LoginData>({
        initialValues: { identifier: "", password: "" },
        validators: { identifier: validators.validateIdentifier, password: validators.validatePassword },
        onSubmit: async ({ identifier, password }) => {
            try {
                startLoading();
                await login(identifier, password);
            } catch (error) {
                showApiError(error, "login");
            } finally {
                stopLoading();
            }
        },
    });

    const passwordResetForm = useForm<PasswordResetData>({
        initialValues: { identifier: "" },
        validators: { identifier: validators.validateIdentifier },
        onSubmit: async ({ identifier }) => {
            try {
                startLoading();
                await authService.resetPassword(identifier);
                setAccessRequested(true);
            } catch (error) {
                showApiError(error, "login");
            } finally {
                stopLoading();
            }
        },
    });

    const handleModeSwitch = () => {
        setMode(mode === "login" ? "password-reset" : "login");
        setAccessRequested(false);
    };

    const renderLoginView = () => (
        <>
            <LoginForm
                data={loginForm.formData}
                touched={loginForm.touched}
                fieldErrors={loginForm.fieldErrors}
                handleChange={loginForm.handleChange}
                handleBlur={loginForm.handleBlur}
                handleSubmit={loginForm.handleSubmit}
                isFormValid={loginForm.isFormValid}
            />
            <Typography variant="subtitle1">
                <Trans i18nKey="login.noAccount" components={{ 1: <Link href={ROUTES.REGISTER} /> }} />
            </Typography>
        </>
    );

    const renderPasswordResetSuccessView = () => (
        <Box sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ color: "success.main", mb: 2 }}>
                {t("login.passwordReset.successMessage")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {t("login.passwordReset.successSubtitle")}
            </Typography>
        </Box>
    );

    const renderPasswordResetView = () => (
        <>
            <PasswordResetForm
                data={passwordResetForm.formData}
                touched={passwordResetForm.touched}
                fieldErrors={passwordResetForm.fieldErrors}
                handleChange={passwordResetForm.handleChange}
                handleBlur={passwordResetForm.handleBlur}
                handleSubmit={passwordResetForm.handleSubmit}
                isFormValid={passwordResetForm.isFormValid}
            />
            <Box sx={{ p: 2, bgcolor: "info.light", borderRadius: 1, border: "1px solid", borderColor: "info.main" }}>
                <Typography variant="body2" color="text.secondary">
                    {t("login.passwordReset.infoMessage")}
                </Typography>
            </Box>
        </>
    );

    const renderContent = () => {
        if (mode === "login") return renderLoginView();
        return accessRequested ? renderPasswordResetSuccessView() : renderPasswordResetView();
    };

    return (
        <Card sx={{ minWidth: 400, p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h1">
                    {mode === "login" ? t("login.title") : t("login.passwordReset.title")}
                </Typography>
                <Typography variant="subtitle1">
                    {mode === "login" ? t("login.subtitle") : t("login.passwordReset.subtitle")}
                </Typography>

                {renderContent()}

                <Divider sx={{ my: 1 }}>{t("login.or")}</Divider>

                <Button variant="outlined" onClick={handleModeSwitch} fullWidth>
                    {mode === "login" ? t("login.passwordReset.switchButton") : t("login.backToLogin")}
                </Button>
            </CardContent>
        </Card>
    );
};

export default Login;
