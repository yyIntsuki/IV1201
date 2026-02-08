import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useNavigate } from "react-router";
import { registerService } from "../services/register-service";
import { ErrorToast } from "../components/ErrorToast";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        // if (!firstName || !lastName || !email || !personNumber || !username || !password) {
        //     setError("All fields are required.");
        //     return;
        // }

        // if (accountService.usernameExists(username)) {
        //     setError("Username already exists");
        //     return;
        // }

        // const newAccount: Account = { firstName, lastName, email, personNumber, username, password, role: "applicant" };

        // accountService.create(newAccount);

        // login("applicant");
        // navigate("/applicant", { replace: true });

        setSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPersonNumber("");
        setUsername("");
        setPassword("");
    };

    const errorToast = error && <ErrorToast open={Boolean(error)} message={error} onClose={() => setError("")} />;

    if (success) {
        return (
            <Box>
                <Typography variant="h1">Registration Successful!</Typography>
                <Typography variant="body1">
                    You are now logged in as an applicant and redirected to your dashboard.
                </Typography>
            </Box>
        );
    }

    return (
        <Container>
            {errorToast}

            <Typography variant="h1">Register</Typography>
            <Typography variant="subtitle1">Please register an account to apply for job application</Typography>

            <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }} onSubmit={handleSubmit}>
                <TextField required label="First Name" defaultValue="" onChange={(e) => setFirstName(e.target.value)} />
                <TextField required label="Last Name" defaultValue="" onChange={(e) => setLastName(e.target.value)} />
                <TextField required label="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
                <TextField required label="Personal Number" onChange={(e) => setPersonNumber(e.target.value)} />
                <TextField required label="Username" defaultValue="" onChange={(e) => setUsername(e.target.value)} />
                <TextField required label="Password" type="password" onChange={(e) => setPassword(e.target.value)} />

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
