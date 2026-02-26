import type { ApplicationRecord, ApplicationStatus } from "@/types/application";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import type { CompetenceProfileEntry } from "@/api/fetch-user-competence-api";
import ApplicationStatusChip from "./ApplicationStatusChip";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import recruiterService from "@/services/recruiter-service";

interface ApplicationDetailsDialogProps {
    application: ApplicationRecord | null;
    onClose: () => void;
    onStatusChange: (newStatus: ApplicationStatus) => void;
}

/**
 * Component that handles job application details in the recruiter page.
 */

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
    application,
    onClose,
    onStatusChange,
}) => {
    const { t } = useTranslation();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError } = useError();

    const [competenceProfile, setCompetenceProfile] = useState<CompetenceProfileEntry[]>([]);

    useEffect(() => {
        const fetchCompetenceProfile = async () => {
            if (!application) return;
            try {
                startLoading();
                const competence = await recruiterService.getUserCompetence(application.userId);
                setCompetenceProfile(competence);
            } catch (error) {
                showApiError(error);
            } finally {
                stopLoading();
            }
        };
        void fetchCompetenceProfile();
    }, [startLoading, stopLoading, showApiError, application]);

    if (!application) return null;
    const { availability, fullName, status } = application;

    return (
        <Dialog open={Boolean(application)} onClose={onClose} fullWidth>
            <DialogTitle>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6">{fullName}</Typography>
                    <ApplicationStatusChip status={status} />
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="h6">{t("recruiter.applications.dialog.expertise")}</Typography>
                {
                    <List dense>
                        {competenceProfile.length === 0 ?
                            <ListItem>
                                <ListItemText
                                    primary={t("recruiter.applications.dialog.noCompetence", "No competence found.")}
                                />
                            </ListItem>
                        :   competenceProfile.map((e) => {
                                const competenceKey =
                                    typeof e.competence === "string" ? e.competence : String(e.competence);
                                return (
                                    <ListItem key={competenceKey}>
                                        <ListItemText
                                            primary={t(`recruiter.applications.dialog.competence.${competenceKey}`)}
                                            secondary={t(`recruiter.applications.dialog.yearsOfExperience`, {
                                                count: e.years_of_experience,
                                            })}
                                        />
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                }

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">{t("recruiter.applications.dialog.availability")}</Typography>
                <List dense>
                    {availability.map((a, i) => (
                        <ListItem key={i}>
                            <ListItemText
                                primary={t("recruiter.applications.dialog.fromTo", { from: a.fromDate, to: a.toDate })}
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => onStatusChange("accepted")} color="success" disabled={status === "accepted"}>
                    {t("recruiter.applications.dialog.accept")}
                </Button>
                <Button onClick={() => onStatusChange("rejected")} color="error" disabled={status === "rejected"}>
                    {t("recruiter.applications.dialog.reject")}
                </Button>
                <Button onClick={() => onStatusChange("unhandled")} disabled={status === "unhandled"}>
                    {t("recruiter.applications.dialog.markUnhandled")}
                </Button>
                <Button onClick={onClose}>{t("recruiter.applications.dialog.close")}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ApplicationDetailsDialog;
