import { useState, useEffect } from "react";
import type { Expertise } from "@/types/application";
import { EXPERTISE_AREAS } from "@/constants/expertise-areas";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ExpertiseInputProps {
    value: Expertise[];
    onChange: (value: Expertise[]) => void;
    onValidityChange?: (isValid: boolean) => void;
}

export const ExpertiseInput: React.FC<ExpertiseInputProps> = ({ value, onChange, onValidityChange }) => {
    const [currentArea, setCurrentArea] = useState("");
    const [currentYears, setCurrentYears] = useState(1);

    const addExpertise = () => {
        if (currentArea && currentYears > 0) {
            onChange([...value, { area: currentArea, years: currentYears }]);
            setCurrentArea("");
            setCurrentYears(1);
        }
    };

    const removeExpertise = (area: string) => {
        onChange(value.filter((exp) => exp.area !== area));
    };

    useEffect(() => {
        if (onValidityChange) {
            onValidityChange(value.length > 0); // valid if at least one expertise
        }
    }, [value, onValidityChange]);

    return (
        <>
            <Typography variant="h5" mb={2}>
                Step 1: Add Areas of Expertise
            </Typography>

            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                <TextField
                    select
                    label="Expertise"
                    fullWidth
                    value={currentArea}
                    onChange={(e) => setCurrentArea(e.target.value)}>
                    {EXPERTISE_AREAS.filter((area) => !value.some((exp) => exp.area === area)).map((area) => (
                        <MenuItem key={area} value={area}>
                            {area}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="number"
                    label="Years"
                    fullWidth
                    slotProps={{ htmlInput: { min: 1 } }}
                    value={currentYears}
                    onChange={(e) => setCurrentYears(Number(e.target.value))}
                />

                <Button variant="contained" onClick={addExpertise} disabled={!currentArea || currentYears < 1}>
                    Add
                </Button>
            </Stack>

            <List dense>
                {value.map((exp) => (
                    <ListItem
                        key={exp.area}
                        secondaryAction={<Button onClick={() => removeExpertise(exp.area)}>Remove</Button>}>
                        <ListItemText primary={exp.area} secondary={`${exp.years} years`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
