import { createContext } from "react";

interface ErrorContextType {
    showError: (message: string) => void;
}

/**
 * Error context to provide error state throughout the app.
 */
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export default ErrorContext;
