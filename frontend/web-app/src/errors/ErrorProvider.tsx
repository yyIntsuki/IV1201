import { useState, useCallback, useMemo } from "react";
import ErrorContext from "./ErrorContext";
import ErrorToast from "@/components/error/ErrorToast";

/**
 * ErrorProvider component that provides error context to its children. By wrapping this provider around the app,
 * it is then possible to pass down error states and trigger errors without manually implementing one in every page.
 */
const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const showError = useCallback((msg: string) => {
        setMessage(msg);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => setOpen(false), []);
    /* Clears message after transition finishes */
    const handleExited = useCallback(() => setMessage(null), []);

    /* Stabilize the context object to avoid re-renders */
    const value = useMemo(() => ({ showError }), [showError]);

    return (
        <ErrorContext.Provider value={value}>
            {children}
            <ErrorToast message={message} open={open} onClose={handleClose} onExited={handleExited} />
        </ErrorContext.Provider>
    );
};

export default ErrorProvider;
