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
    return (
        <>
            <Typography variant="h5" mb={2}>
                Step 3: Review & Submit
            </Typography>

            <Typography variant="subtitle1">Expertise:</Typography>
            <List>
                {competenceList.map((exp, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={`${exp.competence} — ${exp.yearsOfExperience} years`} />
                    </ListItem>
                ))}
            </List>

            <Typography variant="subtitle1">Availability:</Typography>
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
