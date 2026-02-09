import type { JobApplication, ApplicationStatus } from "@/types/application";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ApplicationDetailsDialogProps {
    application: JobApplication | null;
    onClose: () => void;
    onStatusChange: (newStatus: ApplicationStatus) => void;
}

export const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
    application,
    onClose,
    onStatusChange,
}) => {
    if (!application) return null;

    const { expertise, availability, fullName, status } = application;

    return (
        <Dialog open={Boolean(application)} onClose={onClose} fullWidth>
            <DialogTitle>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6">{fullName}</Typography>

                    <Chip
                        label={status}
                        size="small"
                        color={
                            status === "accepted" ? "success"
                            : status === "rejected" ?
                                "error"
                            :   "default"
                        }
                    />
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="h6">Expertise</Typography>
                <List dense>
                    {expertise.map((e) => (
                        <ListItem key={e.area}>
                            <ListItemText primary={e.area} secondary={`${e.years} years`} />
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Availability</Typography>
                <List dense>
                    {availability.map((a, i) => (
                        <ListItem key={i}>
                            <ListItemText primary={`${a.start} → ${a.end}`} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onStatusChange("accepted")} color="success" disabled={status === "accepted"}>
                    Accept
                </Button>
                <Button onClick={() => onStatusChange("rejected")} color="error" disabled={status === "rejected"}>
                    Reject
                </Button>
                <Button onClick={() => onStatusChange("unhandled")} disabled={status === "unhandled"}>
                    Mark as unhandled
                </Button>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};
