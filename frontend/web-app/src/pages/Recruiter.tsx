import { useState } from "react";
import type { JobApplication, ApplicationStatus } from "@/types/application";
import ApplicationsTable from "@/components/recruiter/ApplicationsTable";
import ApplicationDetailsDialog from "@/components/recruiter/ApplicationDetailsDialog";
import dummyApplications from "@/constants/dummy-applications";

import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Recruiter = () => {
    const [applications, setApplications] = useState<JobApplication[]>(dummyApplications);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

    const handleRowClick = (app: JobApplication) => setSelectedApplication(app);

    const handleStatusChange = (status: ApplicationStatus) => {
        if (!selectedApplication) return;

        setApplications((prev) => prev.map((app) => (app.id === selectedApplication.id ? { ...app, status } : app)));

        setSelectedApplication({ ...selectedApplication, status });
    };

    return (
        <Container
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Stack>
                        <Typography variant="h2">Recruiter</Typography>
                        <Typography variant="body1">Expand application details by clicking an entry.</Typography>
                    </Stack>

                    <ApplicationsTable applications={applications} onRowClick={handleRowClick} />

                    <ApplicationDetailsDialog
                        application={selectedApplication}
                        onClose={() => setSelectedApplication(null)}
                        onStatusChange={handleStatusChange}
                    />
                </CardContent>
            </Card>
        </Container>
    );
};

export default Recruiter;
