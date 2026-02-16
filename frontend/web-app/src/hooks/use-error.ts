import { useContext } from "react";
import ErrorContext from "@/errors/ErrorContext";

/**
 * Custom hook to access error context.
 * @returns The error context.
 */
const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useError must be used within an ErrorProvider");
    return context;
};

export default useError;
