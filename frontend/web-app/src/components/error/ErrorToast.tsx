import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface ErrorToastProps {
    message: string | null;
    open: boolean;
    onClose: () => void;
    onExited: () => void;
}
/**
 * An error toast that displays a message at the bottom of the page, and automatically closes after three seconds.
 */
const ErrorToast = ({ message, open, onClose, onExited }: ErrorToastProps) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            slotProps={{ transition: { onExited } }}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            {message ?
                <Alert severity="error" variant="filled">
                    {message}
                </Alert>
            :   undefined}
        </Snackbar>
    );
};

export default ErrorToast;
