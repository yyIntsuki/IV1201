import { useTranslation } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import type { Account } from "@/types/account";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface RegisterFormProps {
    data: Account;
    touched: Record<keyof Account, boolean>;
    fieldErrors: Partial<Record<keyof Account, string>>;
    handleChange: (field: keyof Account, value: string) => void;
    handleBlur: (field: keyof Account) => void;
    handleSubmit: (e: React.FormEvent) => void | Promise<void>;
    isFormValid: boolean;
    readOnlyFields?: (keyof Account)[];
    mode?: "register" | "completion";
}

/**
 * Component that handles register/account completion input. Can be used in both register and account completion flows.
 * When readOnlyFields are provided, those fields will be disabled and marked as verified.
 */
const RegisterForm: React.FC<RegisterFormProps> = ({
    data,
    touched,
    fieldErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
    readOnlyFields = [],
    mode = "register",
}) => {
    const { t } = useTranslation();
    const { loading } = useLoading();

    const fields: (keyof Account)[] = ["firstName", "lastName", "email", "personNumber", "username", "password"];

    const isFieldReadOnly = (field: keyof Account) => readOnlyFields.includes(field);

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 600 }}
            autoComplete="off"
            noValidate
            onSubmit={(e) => void handleSubmit(e)}>
            <Grid container spacing={2} columns={6}>
                {fields.map((field) => {
                    const readOnly = isFieldReadOnly(field);
                    return (
                        <Grid key={field} size={{ sm: 3 }}>
                            <TextField
                                required
                                slotProps={{ inputLabel: { required: false } }}
                                type={field === "password" ? "password" : "text"}
                                label={t(`${mode}.fields.${field}.label`)}
                                placeholder={t(`${mode}.fields.${field}.placeholder`)}
                                value={data[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                onBlur={() => handleBlur(field)}
                                disabled={readOnly}
                                error={!readOnly && touched[field] && Boolean(fieldErrors[field])}
                                helperText={touched[field] && fieldErrors[field] ? fieldErrors[field] : " "}
                                fullWidth
                            />
                        </Grid>
                    );
                })}
            </Grid>
            <Button variant="contained" type="submit" disabled={!isFormValid || loading}>
                {t(`${mode}.submit`)}
            </Button>
        </Box>
    );
};

export default RegisterForm;
