import { useState } from "react";
import type { JobApplication, ApplicationStatus } from "@/types/application";
import { ApplicationsTable } from "@/components/recruiter/ApplicationsTable";
import { ApplicationDetailsDialog } from "@/components/recruiter/ApplicationDetailsDialog";
import { dummyApplications } from "@/constants/dummy-applications";

import Container from "@mui/material/Container";
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
        <Container>
            <Typography variant="h1">Recruiter Page</Typography>
            <Typography variant="body1">Expand application details by clicking an entry.</Typography>

            <ApplicationsTable applications={applications} onRowClick={handleRowClick} />

            <ApplicationDetailsDialog
                application={selectedApplication}
                onClose={() => setSelectedApplication(null)}
                onStatusChange={handleStatusChange}
            />
        </Container>
    );
};

export default Recruiter;
