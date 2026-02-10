import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface LoginFormProps {
    data: { username: string; password: string };
    touched: { username: boolean; password: boolean };
    errors: Partial<Record<"username" | "password", string>>;
    handleChange: (field: "username" | "password", value: string) => void;
    handleBlur: (field: "username" | "password") => void;
    handleSubmit: (e: React.FormEvent) => void;
    isFormValid: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    data,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
}) => {
    const fields: ("username" | "password")[] = ["username", "password"];

    const placeholders: Record<"username" | "password", string> = {
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
                    error={touched[field] && Boolean(errors[field])}
                    helperText={touched[field] && errors[field] ? errors[field] : " "}
                />
            ))}
            <Button variant="contained" type="submit" disabled={!isFormValid}>
                Log in
            </Button>
        </Box>
    );
};

export default LoginForm;
