import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/use-auth";
import ErrorToast from "@/components/ErrorToast";
import LoginForm from "@/components/login/LoginForm";
import { validateUsername, validatePassword, isLoginFormValid } from "@/validation/login";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [usernameTouched, setUsernameTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isFormValid = isLoginFormValid(username, password);

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
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {errorToast}

            <Card sx={{ width: 400, p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h1">Login</Typography>
                    <Typography variant="subtitle1">Please log in to access the application</Typography>

                    <LoginForm
                        username={username}
                        setUsername={setUsername}
                        usernameTouched={usernameTouched}
                        setUsernameTouched={setUsernameTouched}
                        isUsernameValid={isUsernameValid}
                        password={password}
                        setPassword={setPassword}
                        passwordTouched={passwordTouched}
                        setPasswordTouched={setPasswordTouched}
                        isPasswordValid={isPasswordValid}
                        isFormValid={isFormValid}
                        handleSubmit={handleSubmit}
                    />

                    <Typography variant="subtitle1">
                        Don't have an account? <Link href="/register">Register</Link>.
                    </Typography>

                    <Box>
                        <Typography variant="h6">Sample accounts for testing:</Typography>
                        <Typography variant="body1">
                            Recruiter: <b>test1</b> | <b>test</b>
                        </Typography>
                        <Typography variant="body1">
                            Applicant: <b>test</b> | <b>test</b>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Login;
