import type { LoginData } from "@/types/account";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface LoginFormProps {
    data: LoginData;
    touched: Record<keyof LoginData, boolean>;
    fieldErrors: Partial<Record<keyof LoginData, string>>;
    handleChange: (field: keyof LoginData, value: string) => void;
    handleBlur: (field: keyof LoginData) => void;
    handleSubmit: (e: React.FormEvent) => void;
    isFormValid: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    data,
    touched,
    fieldErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
}) => {
    const fields: (keyof LoginData)[] = ["username", "password"];

    const labels: Record<keyof LoginData, string> = { username: "Username", password: "Password" };

    const placeholders: Record<keyof LoginData, string> = { username: "Enter your username", password: "••••••••" };

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
                    label={labels[field]}
                    placeholder={placeholders[field]}
                    value={data[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() => handleBlur(field)}
                    error={touched[field] && Boolean(fieldErrors[field])}
                    helperText={touched[field] && fieldErrors[field] ? fieldErrors[field] : " "}
                />
            ))}
            <Button variant="contained" type="submit" disabled={!isFormValid}>
                Log in
            </Button>
        </Box>
    );
};

export default LoginForm;
