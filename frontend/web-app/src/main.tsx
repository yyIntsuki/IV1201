import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Router from "./Router";
import ErrorProvider from "@/errors/ErrorProvider";
import AuthProvider from "@/auth/AuthProvider";

import "./i18n";

import { theme } from "./theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

/**
 * The main entry point of the React application.
 * AuthProvider wraps the Router to provide authentication context to all routes.
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <ErrorProvider>
                <AuthProvider>
                    <Router />
                </AuthProvider>
            </ErrorProvider>
        </ThemeProvider>
    </StrictMode>,
);
