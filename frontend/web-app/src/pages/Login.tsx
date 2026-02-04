import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { accountService } from "../services/account.service";

import { Box, Typography, TextField, Button, Link } from "@mui/material";

/**
 * The page for handling login.
 * Currently only a dummy page with some minor authentication logic.
 */
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const account = accountService.findByCredentials(username, password);

        if (!account) {
            setError("Invalid username or password");
            return;
        }

        login(account.accountType);

        navigate(account.accountType === "recruiter" ? "/recruiter" : "/applicant", { replace: true });
    };

    return (
        <Box>
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
                    username: <b>app</b>; password: <b>licant</b>
                </Typography>
                <Typography variant="body1">
                    username: <b>rec</b>; password: <b>ruiter</b>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
