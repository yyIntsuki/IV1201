import { Snackbar, Alert } from "@mui/material";

interface Props {
    open: boolean;
    message: string;
    onClose: () => void;
}

export const ErrorToast = ({ open, message, onClose }: Props) => {
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
