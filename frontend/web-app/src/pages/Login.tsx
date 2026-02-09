import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { ErrorToast } from "@/components/ErrorToast";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { role, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            navigate(role === "recruiter" ? "/recruiter" : "/applicant", { replace: true });
        } catch {
            setError("Invalid username or password");
        }
    };

    const errorToast = error && <ErrorToast open={Boolean(error)} message={error} onClose={() => setError("")} />;

    return (
        <Container>
            {errorToast}

            <Typography variant="h1">Login</Typography>
            <Typography variant="subtitle1">Please log in to access the application</Typography>

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
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" type="submit">
                    Log in
                </Button>
            </Box>

            <Typography variant="subtitle1">
                Don't have an account? <Link href="/register">Register</Link>.
            </Typography>

            <Box>
                <Typography variant="h6">Sample accounts for testing:</Typography>
                <Typography variant="body1">
                    Recruiter: <b>test1</b> | <b>test</b>
                </Typography>
                <Typography variant="body1">
                    Applicant: <b>test</b>; <b>test</b>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
