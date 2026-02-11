import { useTranslation } from "react-i18next";
import type { ApplicationStatus } from "@/types/application";

import Chip from "@mui/material/Chip";

interface ApplicationStatusChipProps {
    status: ApplicationStatus;
    size?: "small" | "medium";
}

const statusColorMap: Record<ApplicationStatus, "success" | "error" | "default"> = {
    accepted: "success",
    rejected: "error",
    unhandled: "default",
};

const ApplicationStatusChip: React.FC<ApplicationStatusChipProps> = ({ status, size = "small" }) => {
    const { t } = useTranslation();

    return (
        <Chip label={t(`recruiter.applications.table.status.${status}`)} size={size} color={statusColorMap[status]} />
    );
};

export default ApplicationStatusChip;
