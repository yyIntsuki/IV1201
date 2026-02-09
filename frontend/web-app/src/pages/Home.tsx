import { useNavigate } from "react-router";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const Home = () => {
    const navigate = useNavigate();

    const login = () => {
        navigate("/login");
    };

    const register = () => {
        navigate("/register");
    };

    return (
        <Container sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h1">Amusement Park</Typography>
                <Typography variant="h3" gutterBottom>
                    Recruitement Application
                </Typography>

                <Typography variant="subtitle1">Please log in or register to continue</Typography>

                <ButtonGroup variant="outlined">
                    <Button onClick={login}>Log in</Button>
                    <Button onClick={register}>Register</Button>
                </ButtonGroup>
            </Stack>
        </Container>
    );
};

export default Home;
