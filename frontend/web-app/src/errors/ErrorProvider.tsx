import { type ReactNode, useState } from "react";
import ErrorContext from "./ErrorContext";
import ErrorToast from "@/components/error/ErrorToast";

interface Props {
    children: ReactNode;
}

const ErrorProvider = ({ children }: Props) => {
    const [message, setMessage] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const showError = (msg: string) => {
        setMessage(msg);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    /* Clears message after transition finishes */
    const handleExited = () => setMessage(null);

    return (
        <ErrorContext.Provider value={{ showError }}>
            {children}
            <ErrorToast message={message} open={open} onClose={handleClose} onExited={handleExited} />
        </ErrorContext.Provider>
    );
};

export default ErrorProvider;
