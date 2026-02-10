import { useState, useEffect } from "react";
import type { Competence } from "@/types/application";
import { COMPETENCE } from "@/constants/competence";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface CompetenceInputProps {
    value: Competence[];
    onChange: (value: Competence[]) => void;
    onValidityChange?: (isValid: boolean) => void;
}

export const CompetenceInput: React.FC<CompetenceInputProps> = ({ value, onChange, onValidityChange }) => {
    const [currentCompetence, setCurrentCompetence] = useState("");
    const [currentYearsOfExperience, setCurrentYearsOfExperience] = useState(1);

    const addCompetence = () => {
        if (currentCompetence && currentYearsOfExperience > 0) {
            onChange([...value, { competence: currentCompetence, yearsOfExperience: currentYearsOfExperience }]);
            setCurrentCompetence("");
            setCurrentYearsOfExperience(1);
        }
    };

    const removeCompetence = (competence: string) => {
        onChange(value.filter((exp) => exp.competence !== competence));
    };

    useEffect(() => {
        if (onValidityChange) onValidityChange(value.length > 0);
    }, [value, onValidityChange]);

    return (
        <>
            <Typography variant="h5" mb={2}>
                Step 1: Add Areas of Expertise
            </Typography>

            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                <TextField
                    select
                    label="Select expertise"
                    fullWidth
                    value={currentCompetence}
                    onChange={(e) => setCurrentCompetence(e.target.value)}>
                    {COMPETENCE.filter((competence) => !value.some((exp) => exp.competence === competence)).map(
                        (competence) => (
                            <MenuItem key={competence} value={competence}>
                                {competence}
                            </MenuItem>
                        ),
                    )}
                </TextField>

                <TextField
                    type="number"
                    label="Years"
                    fullWidth
                    slotProps={{ htmlInput: { min: 1 } }}
                    value={currentYearsOfExperience}
                    onChange={(e) => setCurrentYearsOfExperience(Number(e.target.value))}
                />

                <Button
                    variant="contained"
                    onClick={addCompetence}
                    disabled={!currentCompetence || currentYearsOfExperience < 1}>
                    Add
                </Button>
            </Stack>

            <List dense>
                {value.map((exp) => (
                    <ListItem
                        key={exp.competence}
                        secondaryAction={<Button onClick={() => removeCompetence(exp.competence)}>Remove</Button>}>
                        <ListItemText primary={exp.competence} secondary={`${exp.yearsOfExperience} years`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
