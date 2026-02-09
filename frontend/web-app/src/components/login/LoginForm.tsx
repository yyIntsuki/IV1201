import React from "react";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

interface LoginFormProps {
    username: string;
    password: string;
    setUsername: (val: string) => void;
    setPassword: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ username, password, setUsername, setPassword, handleSubmit }) => {
    return (
        <>
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

            <Typography variant="subtitle1">
                Don't have an account? <Link href="/register">Register</Link>.
            </Typography>

            <Box mt={2}>
                <Typography variant="h6">Sample accounts for testing:</Typography>
                <Typography variant="body1">
                    Recruiter: <b>test1</b> | <b>test</b>
                </Typography>
                <Typography variant="body1">
                    Applicant: <b>test</b>; <b>test</b>
                </Typography>
            </Box>
        </>
    );
};
