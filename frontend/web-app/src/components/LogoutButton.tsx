import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

import { Box, Button } from "@mui/material";

/**
 * LogoutButton component with logout button positioned at top right using only positioning.
 */
const LogoutButton = () => {
    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    if (!isLoggedIn) return null;

    return (
        <Box style={{ position: "fixed", top: "0", right: "0", padding: "10px" }}>
            <Button variant="contained" onClick={handleLogout}>
                Log Out
            </Button>
        </Box>
    );
};

export default LogoutButton;
