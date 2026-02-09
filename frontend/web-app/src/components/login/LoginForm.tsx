import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface LoginFormProps {
    username: string;
    password: string;
    setUsername: (val: string) => void;
    setPassword: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ username, password, setUsername, setPassword, handleSubmit }) => {
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
            />
            <TextField
                // error
                // helperText="Incorrect entry."
                required
                slotProps={{ inputLabel: { required: false } }}
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" type="submit">
                Log in
            </Button>
        </Box>
    );
};
