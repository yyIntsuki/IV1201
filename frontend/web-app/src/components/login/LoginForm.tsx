import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface LoginFormProps {
    username: string;
    setUsername: (val: string) => void;

    usernameTouched: boolean;
    setUsernameTouched: (val: boolean) => void;
    isUsernameValid: boolean;

    password: string;
    setPassword: (val: string) => void;

    passwordTouched: boolean;
    setPasswordTouched: (val: boolean) => void;
    isPasswordValid: boolean;

    isFormValid: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    username,
    setUsername,
    usernameTouched,
    setUsernameTouched,
    isUsernameValid,
    password,
    setPassword,
    passwordTouched,
    setPasswordTouched,
    isPasswordValid,
    isFormValid,
    handleSubmit,
}) => {
    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit}>
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setUsernameTouched(true)}
                helperText={usernameTouched && !isUsernameValid ? "Username is required" : " "}
            />
            <TextField
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                helperText={passwordTouched && !isPasswordValid ? "Password is required" : " "}
            />
            <Button variant="contained" type="submit" disabled={!isFormValid}>
                Log in
            </Button>
        </Box>
    );
};

export default LoginForm;
