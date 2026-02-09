import { useState } from "react";
import type { JobApplication, ApplicationStatus } from "../types/application";
import { dummyApplications } from "../constants/dummy-applications";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const Recruiter = () => {
    const [applications, setApplications] = useState<JobApplication[]>(dummyApplications);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

    const updateStatus = (status: ApplicationStatus) => {
        if (!selectedApplication) return;

        setApplications((prev) => prev.map((app) => (app.id === selectedApplication.id ? { ...app, status } : app)));

        setSelectedApplication({ ...selectedApplication, status });
    };

    return (
        <Container>
            <Typography variant="h1">Recruiter Page</Typography>
            <Typography variant="body1">List of job applications below.</Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Applicant Name</strong>
                            </TableCell>
                            <TableCell>
                                <strong>Status</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {applications.map((app) => (
                            <TableRow
                                key={app.id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => setSelectedApplication(app)}>
                                <TableCell>{app.fullName}</TableCell>
                                <TableCell>{app.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={Boolean(selectedApplication)} onClose={() => setSelectedApplication(null)} fullWidth>
                {selectedApplication && (
                    <>
                        <DialogTitle>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="h6">{selectedApplication.fullName}</Typography>

                                <Chip
                                    label={selectedApplication.status}
                                    size="small"
                                    color={
                                        selectedApplication.status === "accepted" ? "success"
                                        : selectedApplication.status === "rejected" ?
                                            "error"
                                        :   "default"
                                    }
                                />
                            </Stack>
                        </DialogTitle>

                        <DialogContent dividers>
                            <Typography variant="h6">Expertise</Typography>
                            <List dense>
                                {selectedApplication.expertise.map((e) => (
                                    <ListItem key={e.area}>
                                        <ListItemText primary={e.area} secondary={`${e.years} years`} />
                                    </ListItem>
                                ))}
                            </List>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6">Availability</Typography>
                            <List dense>
                                {selectedApplication.availability.map((a, i) => (
                                    <ListItem key={i}>
                                        <ListItemText primary={`${a.start} → ${a.end}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={() => updateStatus("accepted")}
                                color="success"
                                disabled={selectedApplication.status === "accepted"}>
                                Accept
                            </Button>

                            <Button
                                onClick={() => updateStatus("rejected")}
                                color="error"
                                disabled={selectedApplication.status === "rejected"}>
                                Reject
                            </Button>

                            <Button
                                onClick={() => updateStatus("unhandled")}
                                disabled={selectedApplication.status === "unhandled"}>
                                Mark as unhandled
                            </Button>

                            <Button onClick={() => setSelectedApplication(null)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default Recruiter;
