import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import Router from "./Router.tsx";

/**
 * The main entry point of the React application.
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Router />
    </StrictMode>,
);
