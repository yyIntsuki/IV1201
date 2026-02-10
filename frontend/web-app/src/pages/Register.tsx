import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ErrorToast from "@/components/ErrorToast";
import registerService from "@/services/register-service";
import RegisterForm from "@/components/register/RegisterForm";
import type { Account } from "@/types/account";
import {
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePersonNumber,
    validateUsername,
    validatePassword,
} from "@/utils/validators";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Link from "@mui/material/Link";

const Register = () => {
    const [formData, setFormData] = useState<Account>({
        firstName: "",
        lastName: "",
        email: "",
        personNumber: "",
        username: "",
        password: "",
    });
    const [touched, setTouched] = useState<Record<keyof Account, boolean>>({
        firstName: false,
        lastName: false,
        email: false,
        personNumber: false,
        username: false,
        password: false,
    });
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Account, string>>>({});
    const [registrationError, setRegistrationError] = useState("");
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const fieldValidators: Record<keyof Account, (val: string) => string | null> = {
        firstName: validateFirstName,
        lastName: validateLastName,
        email: validateEmail,
        personNumber: validatePersonNumber,
        username: validateUsername,
        password: validatePassword,
    };

    const isFormValid = (Object.keys(formData) as (keyof Account)[]).every(
        (field) => !fieldValidators[field](formData[field]),
    );

    const handleChange = (field: keyof Account, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: "" })); // clear previous error on change
    };

    const handleBlur = (field: keyof Account) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const error = fieldValidators[field](formData[field]);
        if (error) setFieldErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<Record<keyof Account, string>> = {};
        (Object.keys(formData) as (keyof Account)[]).forEach((field) => {
            const error = fieldValidators[field](formData[field]);
            if (error) newErrors[field] = error;
        });

        setFieldErrors(newErrors);
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            personNumber: true,
            username: true,
            password: true,
        });

        if (Object.keys(newErrors).length > 0) return;

        try {
            await registerService.register(formData);
            setSuccess(true);
            setFormData({ firstName: "", lastName: "", email: "", personNumber: "", username: "", password: "" });
            setFieldErrors({});
            setTouched({
                firstName: false,
                lastName: false,
                email: false,
                personNumber: false,
                username: false,
                password: false,
            });
        } catch {
            setRegistrationError("Registration failed. Please try again.");
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

    const errorToast = registrationError && (
        <ErrorToast
            open={Boolean(registrationError)}
            message={registrationError}
            onClose={() => setRegistrationError("")}
        />
    );

    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {errorToast}
            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h1">Register</Typography>
                    <Typography variant="subtitle1">Please register to apply for the job application</Typography>

                    <RegisterForm
                        data={formData}
                        touched={touched}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        isFormValid={isFormValid}
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
