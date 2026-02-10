import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/use-auth";
import ErrorToast from "@/components/ErrorToast";
import LoginForm from "@/components/login/LoginForm";
import { validateUsername, validatePassword } from "@/utils/validators";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Login = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [touched, setTouched] = useState({ username: false, password: false });
    const [errors, setErrors] = useState<Partial<Record<"username" | "password", string>>>({});
    const [errorToastMessage, setErrorToastMessage] = useState("");

    const { role, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (field: "username" | "password", value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleBlur = (field: "username" | "password") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const error = field === "username" ? validateUsername(formData.username) : validatePassword(formData.password);
        if (error) setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ username: true, password: true });
        setErrorToastMessage("");

        const usernameError = validateUsername(formData.username);
        const passwordError = validatePassword(formData.password);

        const newErrors: Partial<Record<"username" | "password", string>> = {};
        if (usernameError) newErrors.username = usernameError;
        if (passwordError) newErrors.password = passwordError;

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            await login(formData.username, formData.password);
            navigate(role === "recruiter" ? "/recruiter" : "/applicant", { replace: true });
        } catch {
            setErrorToastMessage("Invalid username or password");
        }
    };

    const isFormValid = !validateUsername(formData.username) && !validatePassword(formData.password);

    const errorToast = errorToastMessage && (
        <ErrorToast
            open={Boolean(errorToastMessage)}
            message={errorToastMessage}
            onClose={() => setErrorToastMessage("")}
        />
    );

    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {errorToast}
            <Card sx={{ width: 400, p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="h1">Login</Typography>
                    <Typography variant="subtitle1">Please log in to access the application</Typography>

                    <LoginForm
                        data={formData}
                        touched={touched}
                        errors={errors}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        handleSubmit={handleSubmit}
                        isFormValid={isFormValid}
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
