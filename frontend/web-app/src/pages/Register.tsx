import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { registerService } from "@/services/register-service";
import { RegisterForm } from "@/components/register/RegisterForm";
import { ErrorToast } from "@/components/ErrorToast";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
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
            <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Card sx={{ display: "inline-block", p: 2 }}>
                    <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography variant="h3">Registration Successful!</Typography>
                        <Typography variant="body1">
                            You will be redirected to the login page shortly. If not, click{" "}
                            <Link href="/login">here</Link>.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const errorToast = error && <ErrorToast open={Boolean(error)} message={error} onClose={() => setError("")} />;

    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {errorToast}

            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h1">Register</Typography>
                    <Typography variant="subtitle1">Please register to apply for the job application</Typography>

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

                    <Typography variant="subtitle1">
                        Already have an account? <Link href="/login">Log in</Link>.
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

export default Register;
