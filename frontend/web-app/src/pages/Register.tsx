import { useState, useEffect } from "react";
import { registerService } from "../services/register-service";
import { ErrorToast } from "../components/ErrorToast";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router";

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
        } catch {
            setError("Registration failed. Please try again.");
        }

        setSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPersonNumber("");
        setUsername("");
        setPassword("");
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

            <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit}>
                <TextField
                    required
                    slotProps={{ inputLabel: { required: false } }}
                    label="First Name"
                    placeholder="Jane"
                    onChange={(e) => setFirstName(e.target.value)}
                    // error
                    // helperText="Incorrect entry."
                />
                <TextField
                    required
                    slotProps={{ inputLabel: { required: false } }}
                    label="Last Name"
                    placeholder="Doe"
                    onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                    required
                    slotProps={{ inputLabel: { required: false } }}
                    label="Email"
                    type="email"
                    placeholder="jane.doe@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    required
                    slotProps={{ inputLabel: { required: false } }}
                    label="Personal Number"
                    placeholder="YYYYMMDD-XXXX"
                    onChange={(e) => setPersonNumber(e.target.value)}
                />
                <TextField
                    required
                    slotProps={{ inputLabel: { required: false } }}
                    label="Username"
                    defaultValue=""
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
                    Register
                </Button>
            </Box>

            <Typography variant="subtitle1">
                Already have an account? <Link href="/login">Log in</Link>.
            </Typography>
        </Container>
    );
};

export default Register;
