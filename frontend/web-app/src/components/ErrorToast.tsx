import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface Props {
    open: boolean;
    message: string;
    onClose: () => void;
}

const ErrorToast = ({ open, message, onClose }: Props) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
            <Alert severity="error" variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ErrorToast;
