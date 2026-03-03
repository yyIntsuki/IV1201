import { useTranslation } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import type { PasswordResetData } from "@/types/login";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface PasswordResetFormProps {
    data: PasswordResetData;
    touched: Record<keyof PasswordResetData, boolean>;
    fieldErrors: Partial<Record<keyof PasswordResetData, string>>;
    handleChange: (field: keyof PasswordResetData, value: string) => void;
    handleBlur: (field: keyof PasswordResetData) => void;
    handleSubmit: (e: React.FormEvent) => void | Promise<void>;
    isFormValid: boolean;
}

/**
 * Component that handles passwordless access request in the login page.
 * Allows users without passwords to request a magic link via email.
 */
const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
    data,
    touched,
    fieldErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
}) => {
    const { t } = useTranslation();
    const { loading } = useLoading();

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            autoComplete="off"
            noValidate
            onSubmit={(e) => void handleSubmit(e)}>
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                type="text"
                label={t("login.passwordReset.fields.identifier.label")}
                placeholder={t("login.passwordReset.fields.identifier.placeholder")}
                value={data.identifier}
                onChange={(e) => handleChange("identifier", e.target.value)}
                onBlur={() => handleBlur("identifier")}
                error={touched.identifier && Boolean(fieldErrors.identifier)}
                helperText={touched.identifier && fieldErrors.identifier ? fieldErrors.identifier : " "}
            />
            <Button variant="contained" type="submit" disabled={!isFormValid || loading}>
                {t("login.passwordReset.submit")}
            </Button>
        </Box>
    );
};

export default PasswordResetForm;
