import { useTranslation } from "react-i18next";
import type { Competence, Availability } from "@/types/application";

import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ReviewSummaryListProps {
    competenceList: Competence[];
    availabilityList: Availability[];
}

const ReviewSummaryList: React.FC<ReviewSummaryListProps> = ({ competenceList, availabilityList }) => {
    const { t } = useTranslation();

    return (
        <>
            <Typography variant="h5" mb={2}>
                {t("applicant.applicationForm.review.title")}
            </Typography>

            <Typography variant="h6">{t("applicant.applicationForm.review.expertise")}</Typography>
            <List>
                {competenceList.map((exp, i) => (
                    <ListItem key={i}>
                        <ListItemText
                            primary={`${t(`applicant.applicationForm.competence.${exp.competence}`)} — ${exp.yearsOfExperience} ${t("applicant.applicationForm.years")}`}
                        />
                    </ListItem>
                ))}
            </List>

            <Typography variant="h6">{t("applicant.applicationForm.review.availability")}</Typography>
            <List>
                {availabilityList.map((a, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={`${a.fromDate} → ${a.toDate}`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default ReviewSummaryList;
