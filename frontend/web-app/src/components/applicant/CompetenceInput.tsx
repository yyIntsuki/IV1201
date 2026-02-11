import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import COMPETENCE from "@/constants/competence";
import type { Competence } from "@/types/application";

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

const CompetenceInput: React.FC<CompetenceInputProps> = ({ value, onChange, onValidityChange }) => {
    const [currentCompetence, setCurrentCompetence] = useState("");
    const [currentYearsOfExperience, setCurrentYearsOfExperience] = useState(1);

    const { t } = useTranslation();

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
                {t("applicant.applicationForm.expertise.title")}
            </Typography>

            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                <TextField
                    select
                    label={t("applicant.applicationForm.expertise.selectLabel")}
                    fullWidth
                    value={currentCompetence}
                    onChange={(e) => setCurrentCompetence(e.target.value)}>
                    {COMPETENCE.filter((competence) => !value.some((exp) => exp.competence === competence)).map(
                        (competence) => (
                            <MenuItem key={competence} value={competence}>
                                {t(`applicant.applicationForm.competence.${competence}`)}
                            </MenuItem>
                        ),
                    )}
                </TextField>

                <TextField
                    type="number"
                    label={t("applicant.applicationForm.expertise.yearsLabel")}
                    fullWidth
                    slotProps={{ htmlInput: { min: 1 } }}
                    value={currentYearsOfExperience}
                    onChange={(e) => setCurrentYearsOfExperience(Number(e.target.value))}
                />

                <Button
                    variant="contained"
                    onClick={addCompetence}
                    disabled={!currentCompetence || currentYearsOfExperience < 1}>
                    {t("applicant.applicationForm.add")}
                </Button>
            </Stack>

            <List dense>
                {value.map((exp) => (
                    <ListItem
                        key={exp.competence}
                        secondaryAction={
                            <Button onClick={() => removeCompetence(exp.competence)}>
                                {t("applicant.applicationForm.remove")}
                            </Button>
                        }>
                        <ListItemText
                            primary={t(`applicant.applicationForm.competence.${exp.competence}`)}
                            secondary={`${exp.yearsOfExperience} ${t("applicant.applicationForm.years")}`}
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default CompetenceInput;
