import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/use-auth";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const { role, login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        try {
            await login(username, password);
            navigate(role === "recruiter" ? "/recruiter" : "/applicant", { replace: true });
        } catch {
            setLoginError("Invalid username or password");
        }
    };

    return (
        <Container>
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

                {loginError && <Box style={{ color: "red" }}>{loginError}</Box>}
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
