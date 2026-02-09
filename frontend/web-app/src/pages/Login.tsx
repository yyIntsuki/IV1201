import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { LoginForm } from "@/components/login/LoginForm";
import { ErrorToast } from "@/components/ErrorToast";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

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

            <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
        </Container>
    );
};

export default Login;
