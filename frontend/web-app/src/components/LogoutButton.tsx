import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

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
        <div
            style={{
                position: "fixed",
                top: "0",
                right: "0",
                padding: "10px",
            }}>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default LogoutButton;
