import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import ROUTES from "@/constants/routes";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

/**
 * Home page component.
 */
const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const login = () => void navigate(ROUTES.LOGIN);
    const register = () => void navigate(ROUTES.REGISTER);

    return (
        <Stack sx={{ justifyContent: "center", alignItems: "center" }}>
            <Typography variant="h1">{t("home.title")}</Typography>
            <Typography variant="h3">{t("home.subtitle")}</Typography>

            <ButtonGroup sx={{ p: 4 }} variant="outlined">
                <Button onClick={login}>{t("home.login")}</Button>
                <Button onClick={register}>{t("home.register")}</Button>
            </ButtonGroup>

            <Typography variant="subtitle1">{t("home.description")}</Typography>
        </Stack>
    );
};

export default Home;
