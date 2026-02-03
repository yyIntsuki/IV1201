import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router";
import AuthProvider from "./auth/AuthProvider";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

/**
 * The main entry point of the React application.
 * AuthProvider wraps the Router to provide authentication context to all routes.
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router />
            </AuthProvider>
        </ThemeProvider>
    </StrictMode>,
);
