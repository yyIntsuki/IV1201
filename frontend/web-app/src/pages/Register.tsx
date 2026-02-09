import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { registerService } from "@/services/register-service";
import { RegisterForm } from "@/components/register/RegisterForm";
import { ErrorToast } from "@/components/ErrorToast";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [personNumber, setPersonNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!firstName || !lastName || !email || !personNumber || !username || !password) {
            setError("All fields are required.");
            return;
        }

        try {
            await registerService.register({ firstName, lastName, email, personNumber, username, password });
            setSuccess(true);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPersonNumber("");
            setUsername("");
            setPassword("");
        } catch {
            setError("Registration failed. Please try again.");
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    if (success) {
        return (
            <Box>
                <Typography variant="h1">Registration Successful!</Typography>
                <Typography variant="body1">
                    You will be redirected to the login page shortly. If not, click <Link href="/login">here</Link>.
                </Typography>
            </Box>
        );
    }

    const errorToast = error && <ErrorToast open={Boolean(error)} message={error} onClose={() => setError("")} />;

    return (
        <Container>
            {errorToast}

            <Typography variant="h1">Register</Typography>
            <Typography variant="subtitle1">Please register an account to apply for job application</Typography>

            <RegisterForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                personNumber={personNumber}
                username={username}
                password={password}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setEmail={setEmail}
                setPersonNumber={setPersonNumber}
                setUsername={setUsername}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
        </Container>
    );
};

export default Register;
