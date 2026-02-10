import type { Account } from "@/types/account";

import Box from "@mui/material/Box";
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
    const fields: (keyof Account)[] = ["firstName", "lastName", "email", "personNumber", "username", "password"];

    const placeholders: Record<keyof Account, string> = {
        firstName: "Jane",
        lastName: "Doe",
        email: "jane.doe@example.com",
        personNumber: "YYYYMMDD-XXXX",
        username: "Enter your username",
        password: "••••••••",
    };

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}>
            {fields.map((field) => (
                <TextField
                    key={field}
                    required
                    slotProps={{ inputLabel: { required: false } }}
                    type={field === "password" ? "password" : "text"}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    placeholder={placeholders[field]}
                    value={data[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    error={touched[field] && Boolean(fieldErrors[field])}
                    helperText={touched[field] && fieldErrors[field] ? fieldErrors[field] : " "}
                />
            ))}
            <Button variant="contained" type="submit" disabled={!isFormValid}>
                Register
            </Button>
        </Box>
    );
};

export default RegisterForm;
