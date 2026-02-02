import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root.tsx";

/**
 * The main entry point of the React application.
 */
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Root />
    </StrictMode>,
);
