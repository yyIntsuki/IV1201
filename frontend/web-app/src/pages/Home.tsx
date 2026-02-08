import { useNavigate } from "react-router";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
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
        <Container>
            <Typography variant="h1">Amusement Park</Typography>
            <Typography variant="h2" gutterBottom>
                Recruitement Application
            </Typography>
            <Typography variant="subtitle1">Log in or register to continue</Typography>

            <ButtonGroup variant="outlined">
                <Button onClick={login}>Log in</Button>
                <Button onClick={register}>Register</Button>
            </ButtonGroup>
        </Container>
    );
};

export default Home;
