import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useLoading from "@/hooks/use-loading";

import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const LOADING_MESSAGE_DELAY_MS = 5000;

/**
 * A full-screen loading overlay that shows a slow message after a certain delay.
 */
const LoadingScreen = () => {
    const { t } = useTranslation();
    const { loading } = useLoading();
    const [showSlowMessage, setShowSlowMessage] = useState(false);

    useEffect(() => {
        if (!loading) return;

        const timer = setTimeout(() => {
            setShowSlowMessage(true);
        }, LOADING_MESSAGE_DELAY_MS);

        return () => {
            clearTimeout(timer);
            setShowSlowMessage(false);
        };
    }, [loading]);

    return (
        <Backdrop open={loading} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CircularProgress color="inherit" />
                <Typography
                    variant="subtitle1"
                    sx={{ mt: 1, opacity: showSlowMessage ? 1 : 0, transition: "opacity 300ms ease" }}>
                    {t("loading.slowMessage")}
                </Typography>
            </Box>
        </Backdrop>
    );
};

export default LoadingScreen;
