import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ApplicationRecord, ApplicationStatus } from "@/types/application";
import ApplicationsTable from "@/components/recruiter/ApplicationsTable";
import ApplicationDetailsDialog from "@/components/recruiter/ApplicationDetailsDialog";
import fetchAvailabilities from "@/api/availability-api";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Recruiter = () => {
    const [applications, setApplications] = useState<ApplicationRecord[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);

    const { t } = useTranslation();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const paginatedApps = applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        const loadAvailabilities = async () => {
            try {
                const data = await fetchAvailabilities();
                const grouped = data.reduce<Record<number, { fullName: string; availability: { fromDate: string; toDate: string }[] }>>(
                    (acc, item) => {
                        if (!acc[item.user_id]) {
                            acc[item.user_id] = {
                                fullName: `${item.name} ${item.surname}`,
                                availability: [],
                            };
                        }
                        acc[item.user_id].availability.push({
                            fromDate: item.from_date,
                            toDate: item.to_date,
                        });
                        return acc;
                    },
                    {}
                );

                const mapped: ApplicationRecord[] = Object.entries(grouped).map(([userId, entry]) => ({
                    id: userId,
                    fullName: entry.fullName,
                    status: "unhandled",
                    competenceProfile: [],
                    availability: entry.availability,
                }));

                setApplications(mapped);
            } catch (error) {
                console.error("Failed to load availabilities", error);
            }
        };

        loadAvailabilities();
    }, []);

    const handleRowClick = (app: ApplicationRecord) => setSelectedApplication(app);

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
