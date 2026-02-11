import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { JobApplication, ApplicationStatus } from "@/types/application";
import ApplicationsTable from "@/components/recruiter/ApplicationsTable";
import ApplicationDetailsDialog from "@/components/recruiter/ApplicationDetailsDialog";
import dummyApplications from "@/constants/dummy-applications";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Recruiter = () => {
    const [applications, setApplications] = useState<JobApplication[]>(dummyApplications);
    const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

    const { t } = useTranslation();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const paginatedApps = applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleRowClick = (app: JobApplication) => setSelectedApplication(app);

    const handleStatusChange = (status: ApplicationStatus) => {
        if (!selectedApplication) return;

        setApplications((prev) => prev.map((app) => (app.id === selectedApplication.id ? { ...app, status } : app)));

        setSelectedApplication({ ...selectedApplication, status });
    };

    return (
        <>
            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Stack>
                        <Typography variant="h2">{t("recruiter.title")}</Typography>
                        <Typography variant="body1">{t("recruiter.subtitle")}</Typography>
                    </Stack>

                    <ApplicationsTable
                        applications={paginatedApps}
                        totalCount={applications.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={setPage}
                        onRowsPerPageChange={(rows) => {
                            setRowsPerPage(rows);
                            setPage(0);
                        }}
                        onRowClick={handleRowClick}
                    />

                    <ApplicationDetailsDialog
                        application={selectedApplication}
                        onClose={() => setSelectedApplication(null)}
                        onStatusChange={handleStatusChange}
                    />
                </CardContent>
            </Card>
        </>
    );
};

export default Recruiter;
