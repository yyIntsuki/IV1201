import { useTranslation, Trans } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import useAuth from "@/hooks/use-auth";
import useForm from "@/hooks/use-form";
import ROUTES from "@/constants/routes";
import type { LoginData } from "@/types/login";
import formValidator from "@/utils/form-validator";
import LoginForm from "@/components/login/LoginForm";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Login = () => {
    const { t } = useTranslation();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError } = useError();
    const { login } = useAuth();

    const validators = formValidator(t);
    const { formData, touched, fieldErrors, handleChange, handleBlur, handleSubmit, isFormValid } = useForm<LoginData>({
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
                    <Trans i18nKey="login.noAccount" components={{ 1: <Link href={ROUTES.REGISTER} /> }} />
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Login;
