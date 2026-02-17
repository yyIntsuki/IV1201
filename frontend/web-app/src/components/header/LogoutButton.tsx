import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useAuth from "@/hooks/use-auth";
import ROUTES from "@/constants/routes";

import Button from "@mui/material/Button";

/**
 * Logout Button component. Only shown if user is already logged in.
 */
const LogoutButton = () => {
    const { isLoggedIn, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        void navigate(ROUTES.HOME, { replace: true });
    };

    if (!isLoggedIn) return null;

    return (
        <Button variant="contained" onClick={handleLogout}>
            {t("logout")}
        </Button>
    );
};

export default LogoutButton;
