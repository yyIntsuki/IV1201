import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGoBack = () => void navigate(-1);

    return (
        <Card sx={{ display: "inline-block", p: 2 }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "center" }}>
                <Typography variant="h1">404</Typography>
                <Typography variant="h5">{t("notFound.title")}</Typography>
                <Typography variant="body1">{t("notFound.message")}</Typography>
                <Button variant="contained" onClick={handleGoBack}>
                    {t("notFound.goBack")}
                </Button>
            </CardContent>
        </Card>
    );
};

export default NotFound;
