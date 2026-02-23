import { useState } from "react";
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

/**
 * The Register component is responsible for rendering the registration form and handling the submission of the form.
 * It uses the useForm hook to manage the form state and validation, and the useLoading and useError hooks to handle loading and error states.
 * When the form is submitted successfully, it sets the success state to true and navigates the user to the login page after a short delay.
 * If the form submission fails, it shows an API error message.
 */
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

                setTimeout(() => {
                    void navigate(ROUTES.LOGIN);
                }, 3000);
            } catch (error) {
                showApiError(error, "register");
            } finally {
                stopLoading();
            }
        },
    });

    return (
        <Card sx={{ display: "inline-block", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {success ?
                    <>
                        <Typography variant="h3">{t("register.successTitle")}</Typography>
                        <Typography variant="body1">
                            <Trans i18nKey="register.successMessage" components={{ 1: <Link href={ROUTES.LOGIN} /> }} />
                        </Typography>
                    </>
                :   <>
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
                            <Trans i18nKey="register.haveAccount" components={{ 1: <Link href={ROUTES.LOGIN} /> }} />
                        </Typography>
                    </>
                }
            </CardContent>
        </Card>
    );
};

export default Register;
