import { useNavigate } from "react-router";

import { Box, Typography, Button, ButtonGroup } from "@mui/material";

const Home = () => {
    const navigate = useNavigate();

    const login = () => {
        navigate("/login");
    };

    const register = () => {
        navigate("/register");
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
        </Box>
    );
};

export default Home;
