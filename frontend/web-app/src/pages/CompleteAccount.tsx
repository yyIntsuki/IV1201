import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import useForm from "@/hooks/use-form";
import ROUTES from "@/constants/routes";
import type { Account } from "@/types/account";
import completeAccountService from "@/services/complete-account-service";
import formValidator from "@/utils/form-validator";
import RegisterForm from "@/components/register/RegisterForm";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";

/**
 * The CompleteAccount component handles the account completion flow for users who have incomplete account information
 * (missing username, password, etc.). It verifies the magic link token, loads existing account data, and allows users
 * to fill in missing fields.
 */
const CompleteAccount = () => {
    const [tokenVerified, setTokenVerified] = useState(false);
    const [accountData, setAccountData] = useState<Partial<Account> | null>(null);
    const [readOnlyFields, setReadOnlyFields] = useState<(keyof Account)[]>([]);
    const [success, setSuccess] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError, showError } = useError();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            showError(t("completion.errors.noToken"));
            setTimeout(() => navigate(ROUTES.LOGIN), 2000);
            return;
        }

        const verifyTokenAndLoadData = async () => {
            try {
                startLoading();
                const data = await completeAccountService.verifyToken(token);

                /* Determine which fields are read-only (have values) */
                const readOnly = (Object.keys(data) as (keyof Account)[]).filter(
                    (key) => data[key] !== null && data[key] !== undefined && data[key] !== "",
                );

                setAccountData(data);
                setReadOnlyFields(readOnly);
                setTokenVerified(true);
            } catch (error) {
                showApiError(error, "completion");
                setTimeout(() => navigate(ROUTES.LOGIN), 3000);
            } finally {
                stopLoading();
            }
        };

        void verifyTokenAndLoadData();

        return () => {
            completeAccountService.clearSession();
        };
    }, [token, navigate, startLoading, stopLoading, showApiError, showError, t]);

    const validator = formValidator(t);
    const initialValues = useMemo(
        () => ({
            firstName: accountData?.firstName || "",
            lastName: accountData?.lastName || "",
            email: accountData?.email || "",
            personNumber: accountData?.personNumber || "",
            username: accountData?.username || "",
            password: accountData?.password || "",
        }),
        [accountData],
    );

    const { formData, touched, fieldErrors, handleChange, handleBlur, handleSubmit, isFormValid } = useForm<Account>({
        initialValues,
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
                await completeAccountService.completeAccount(data);
                setSuccess(true);

                setTimeout(() => {
                    void navigate(ROUTES.LOGIN);
                }, 2000);
            } catch (error) {
                showApiError(error, "register");
            } finally {
                stopLoading();
            }
        },
    });

    if (!tokenVerified) return null;

    return (
        <Card sx={{ display: "inline-block", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {success ?
                    <>
                        <Typography variant="h3">{t("completion.successTitle")}</Typography>
                        <Typography variant="body1">{t("completion.successMessage")}</Typography>
                    </>
                :   <>
                        <Typography variant="h1">{t("completion.title")}</Typography>
                        <Typography variant="subtitle1">{t("completion.subtitle")}</Typography>

                        {readOnlyFields.length > 0 && <Alert severity="info">{t("completion.prefilledInfo")}</Alert>}

                        <RegisterForm
                            data={formData}
                            touched={touched}
                            fieldErrors={fieldErrors}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            handleSubmit={handleSubmit}
                            isFormValid={isFormValid}
                            readOnlyFields={readOnlyFields}
                            mode="completion"
                        />
                    </>
                }
            </CardContent>
        </Card>
    );
};

export default CompleteAccount;
