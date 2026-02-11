import { useState, useEffect, type FC } from "react";
import { useTranslation } from "react-i18next";
import type { Availability } from "@/types/application";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface AvailabilityInputProps {
    value: Availability[];
    onChange: (value: Availability[]) => void;
    onValidityChange?: (isValid: boolean) => void;
}

const AvailabilityInput: FC<AvailabilityInputProps> = ({ value, onChange, onValidityChange }) => {
    const [currentFromDate, setCurrentFromDate] = useState("");
    const [currentToDate, setCurrentToDate] = useState("");

    const { t } = useTranslation();

    const handleStartChange = (value: string) => {
        setCurrentFromDate(value);
        if (currentToDate && value > currentToDate) {
            setCurrentToDate("");
        }
    };

    const addAvailability = () => {
        if (!currentFromDate || !currentToDate) return;
        if (currentToDate < currentFromDate) return;

        onChange([...value, { fromDate: currentFromDate, toDate: currentToDate }]);
        setCurrentFromDate("");
        setCurrentToDate("");
    };

    const removeAvailability = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const isValidRange = currentFromDate && currentToDate && currentFromDate <= currentToDate;

    useEffect(() => {
        const isValid = value.length > 0;
        if (onValidityChange) onValidityChange(isValid);
    }, [value, onValidityChange]);

    return (
        <>
            <Typography variant="h5" mb={2}>
                {t("applicant.applicationForm.availability.title")}
            </Typography>

            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                <TextField
                    type="date"
                    label={t("applicant.applicationForm.availability.startLabel")}
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    value={currentFromDate}
                    onChange={(e) => handleStartChange(e.target.value)}
                />

                <TextField
                    type="date"
                    label={t("applicant.applicationForm.availability.endLabel")}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: currentFromDate } }}
                    fullWidth
                    value={currentToDate}
                    onChange={(e) => setCurrentToDate(e.target.value)}
                />

                <Button variant="contained" onClick={addAvailability} disabled={!isValidRange}>
                    {t("applicant.applicationForm.add")}
                </Button>
            </Stack>

            <List dense>
                {value.map((a, i) => (
                    <ListItem
                        key={i}
                        secondaryAction={
                            <Button onClick={() => removeAvailability(i)}>{t("applicant.applicationForm.remove")}</Button>
                        }>
                        <ListItemText primary={`${a.fromDate} → ${a.toDate}`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default AvailabilityInput;
