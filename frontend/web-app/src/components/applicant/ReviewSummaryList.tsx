import type { Expertise, Availability } from "@/types/application";

import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ReviewSummaryListProps {
    expertiseList: Expertise[];
    availabilityList: Availability[];
}

export const ReviewSummaryList: React.FC<ReviewSummaryListProps> = ({ expertiseList, availabilityList }) => {
    return (
        <>
            <Typography variant="h5" mb={2}>
                Step 3: Review & Submit
            </Typography>

            <Typography variant="subtitle1">Expertise:</Typography>
            <List>
                {expertiseList.map((exp, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={`${exp.area} — ${exp.years} years`} />
                    </ListItem>
                ))}
            </List>

            <Typography variant="subtitle1">Availability:</Typography>
            <List>
                {availabilityList.map((a, i) => (
                    <ListItem key={i}>
                        <ListItemText primary={`${a.start} → ${a.end}`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
