import Attractions from "@mui/icons-material/attractions";

import LogoutButton from "@/components/header/LogoutButton";
import LanguageToggleButton from "@/components/header/LanguageToggleButton";

import { Box, Typography } from "@mui/material";

const Header = () => (
    <Box
        component="header"
        sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            zIndex: 10,
        }}>
        <Box sx={{ display: "flex", gap: 2 }}>
            <Attractions fontSize="large" />
            <Typography variant="h6">Amusement Park</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
            <LogoutButton />
            <LanguageToggleButton />
        </Box>
    </Box>
);

export default Header;
