import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import recruiterService from "@/services/recruiter-service";
import type { ApplicationRecord, ApplicationStatus } from "@/types/application";
import ApplicationsTable from "@/components/recruiter/ApplicationsTable";
import ApplicationDetailsDialog from "@/components/recruiter/ApplicationDetailsDialog";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

/**
 * Page for recruiters to view and manage job applications.
 * Handles all data fetching — both the application list and the competence profile
 * for the selected application — and passes data down to child components as props.
 */
const Recruiter = () => {
    const [applications, setApplications] = useState<ApplicationRecord[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);

    const { t } = useTranslation();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError } = useError();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const paginatedApps = applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                startLoading();
                const apps = await recruiterService.getApplications();
                setApplications(apps);
            } catch (error) {
                showApiError(error);
            } finally {
                stopLoading();
            }
        };
        void loadApplications();
    }, [startLoading, stopLoading, showApiError]);

    const handleRowClick = async (app: ApplicationRecord) => {
        setSelectedApplication(app);
        try {
            startLoading();
            const competenceProfile = await recruiterService.getUserCompetence(app.userId);
            setSelectedApplication({ ...app, competenceProfile });
        } catch (error) {
            showApiError(error);
        } finally {
            stopLoading();
        }
    };

    const handleStatusChange = async (status: ApplicationStatus, expectedStatus: ApplicationStatus) => {
        if (!selectedApplication) return;

        try {
            startLoading();
            await recruiterService.setApplicationStatus(selectedApplication.applicationId, status, expectedStatus);
            setApplications((prev) =>
                prev.map((app) => (app.applicationId === selectedApplication.applicationId ? { ...app, status } : app)),
            );
            setSelectedApplication({ ...selectedApplication, status });
        } catch (error) {
            showApiError(error);
        } finally {
            stopLoading();
        }
    };

    return (
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
                    onRowClick={(app) => void handleRowClick(app)}
                />

                <ApplicationDetailsDialog
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onStatusChange={(status) =>
                        selectedApplication && void handleStatusChange(status, selectedApplication.status)
                    }
                />
            </CardContent>
        </Card>
    );
};

export default Recruiter;
