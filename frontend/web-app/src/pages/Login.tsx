import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

import { Container, Box, Typography, TextField, Button, Link } from "@mui/material";

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
                <TextField required label="Username" defaultValue="" onChange={(e) => setUsername(e.target.value)} />
                <TextField required label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

                <Button variant="contained" type="submit">
                    Log in
                </Button>

                {error && <Box style={{ color: "red" }}>{error}</Box>}
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
