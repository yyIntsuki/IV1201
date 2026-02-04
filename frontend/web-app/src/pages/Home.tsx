import { useState } from "react";
import { useNavigate } from "react-router";
import { healthCheck } from "../api/health.api";

import { Box, Typography, Button, ButtonGroup } from "@mui/material";

const Home = () => {
    const [corsResult, setCorsResult] = useState<string | null>(null);
    const [corsError, setCorsError] = useState<string | null>(null);

    const navigate = useNavigate();

    const login = () => {
        navigate("/login");
    };

    const register = () => {
        navigate("/register");
    };

    const testCors = async () => {
        setCorsResult(null);
        setCorsError(null);

        try {
            const data = await healthCheck();
            setCorsResult(JSON.stringify(data));
        } catch {
            setCorsError("CORS request failed");
        }
    };

    return (
        <Box>
            <Typography variant="h1">Amusement Park</Typography>
            <Typography variant="h2" gutterBottom>
                Recruitement Application
            </Typography>
            <Typography variant="subtitle1">Log in or register to continue</Typography>

            <ButtonGroup variant="outlined">
                <Button onClick={login}>Log in</Button>
                <Button onClick={register}>Register</Button>
            </ButtonGroup>

            <Box>
                <Typography variant="h6">CORS Test</Typography>
                <Button variant="outlined" onClick={testCors}>
                    Test CORS
                </Button>

                {corsResult && <p style={{ color: "green" }}>{corsResult}</p>}
                {corsError && <p style={{ color: "red" }}>{corsError}</p>}
            </Box>
        </Box>
    );
};

export default Home;
