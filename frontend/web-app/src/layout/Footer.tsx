import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/**
 * A small footer at the bottom of the page, showing the copyright information.
 */
const Footer = () => (
    <Box
        component="footer"
        sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            p: 2,
            zIndex: 10,
        }}>
        <Typography variant="caption" sx={{ userSelect: "none" }}>
            © 2026 Amusement Park
        </Typography>
    </Box>
);

export default Footer;
