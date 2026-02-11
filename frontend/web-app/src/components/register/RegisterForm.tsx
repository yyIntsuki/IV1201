import { useTranslation } from "react-i18next";
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
    handleSubmit: (e: React.FormEvent) => void;
    isFormValid: boolean;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
    data,
    touched,
    fieldErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
}) => {
    const { t } = useTranslation();

    const fields: (keyof Account)[] = ["firstName", "lastName", "email", "personNumber", "username", "password"];

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: 600 }}
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}>
            <Grid container spacing={2} columns={6}>
                {fields.map((field) => (
                    <Grid key={field} size={{ sm: 3 }}>
                        <TextField
                            required
                            slotProps={{ inputLabel: { required: false } }}
                            type={field === "password" ? "password" : "text"}
                            label={t(`register.fields.${field}.label`)}
                            placeholder={t(`register.fields.${field}.placeholder`)}
                            value={data[field]}
                            onChange={(e) => handleChange(field, e.target.value)}
                            onBlur={() => handleBlur(field)}
                            error={touched[field] && Boolean(fieldErrors[field])}
                            helperText={touched[field] && fieldErrors[field] ? fieldErrors[field] : " "}
                            fullWidth
                        />
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" type="submit" disabled={!isFormValid}>
                {t("register.submit")}
            </Button>
        </Box>
    );
};

export default RegisterForm;
