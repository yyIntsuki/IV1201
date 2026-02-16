import { createContext } from "react";

interface ErrorContextType { showError: (message: string) => void; }

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export default ErrorContext;
