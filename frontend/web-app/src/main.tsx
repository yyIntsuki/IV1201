import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import Router from "./Router";
import AuthProvider from "./auth/AuthProvider";

/**
 * The main entry point of the React application.
 * AuthProvider wraps the Router to provide authentication context to all routes.
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>,
);
