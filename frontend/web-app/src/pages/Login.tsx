import { useTranslation, Trans } from "react-i18next";
import useAuth from "@/hooks/use-auth";
import useError from "@/hooks/use-error";
import useForm from "@/hooks/use-form";
import LoginForm from "@/components/login/LoginForm";
import type { LoginData } from "@/types/account";
import formValidator from "@/utils/form-validator";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Login = () => {
    const { t } = useTranslation();
    const validators = formValidator(t);
    const { login } = useAuth();
    const { showApiError } = useError();
    const { formData, touched, fieldErrors, handleChange, handleBlur, handleSubmit, isFormValid } = useForm<LoginData>({
        initialValues: { username: "", password: "" },
        validators: { username: validators.validateUsername, password: validators.validatePassword },
        onSubmit: async ({ username, password }) => {
            try {
                await login(username, password);
            } catch (error) {
                showApiError(error, "login");
            }
        },
    });

    return (
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
                    <Trans i18nKey="login.noAccount" components={{ 1: <Link href="/register" /> }} />
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Login;
