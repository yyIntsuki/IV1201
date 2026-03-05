import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import useAuth from "@/hooks/use-auth";
import useForm from "@/hooks/use-form";
import ROUTES from "@/constants/routes";
import type { Account } from "@/types/account";
import completeAccountService from "@/services/complete-account-service";
import fetchUserDataApi from "@/api/fetch-user-data-api";
import formValidator from "@/utils/form-validator";
import { getUserIdFromJwt } from "@/utils/jwt-decoder";
import STORAGE_KEYS from "@/constants/storage-keys";
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
    const { isLoggedIn, token: authToken } = useAuth();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError, showError } = useError();

    const magicToken = searchParams.get("token");
    const redirectTo = searchParams.get("redirect");

    useEffect(() => {
        const loadAccountData = async () => {
            try {
                startLoading();
                let data: Partial<Account>;

                if (magicToken) {
                    /* User arrived via magic link token from email */
                    data = await completeAccountService.verifyToken(magicToken);
                } else if (isLoggedIn && authToken) {
                    /* Logged-in user redirected here (e.g., from ProtectedRoute) */
                    const userId = getUserIdFromJwt(authToken);
                    if (!userId) throw new Error("Invalid session. Please log in again.");

                    /* Set completion storage manually so the service works as expected */
                    sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, authToken);
                    sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, userId.toString());

                    data = await fetchUserDataApi(userId);
                } else {
                    /* Neither flow: Missing token and not logged in */
                    showError(t("completion.errors.noToken"));
                    setTimeout(() => navigate(ROUTES.LOGIN), 2000);
                    return;
                }

                /* Determine which fields are read-only (have existing values) */
                const readOnly = (Object.keys(data) as (keyof Account)[]).filter((key) => !!data[key]);

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

        void loadAccountData();

        return () => {
            completeAccountService.clearSession();
        };
    }, [magicToken, isLoggedIn, authToken, navigate, startLoading, stopLoading, showApiError, showError, t]);

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
                    if (isLoggedIn && redirectTo) {
                        void navigate(redirectTo);
                    } else {
                        void navigate(ROUTES.LOGIN);
                    }
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
