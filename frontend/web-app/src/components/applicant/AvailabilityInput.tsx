import { useState, useEffect, type FC } from "react";
import { Typography, TextField, Button, List, ListItem, ListItemText, Stack, Divider } from "@mui/material";
import type { Availability } from "../../types/application";

interface AvailabilityInputProps {
    value: Availability[];
    onChange: (value: Availability[]) => void;
    onValidityChange?: (isValid: boolean) => void;
}

export const AvailabilityInput: FC<AvailabilityInputProps> = ({ value, onChange, onValidityChange }) => {
    const [currentStart, setCurrentStart] = useState("");
    const [currentEnd, setCurrentEnd] = useState("");

    const handleStartChange = (value: string) => {
        setCurrentStart(value);
        if (currentEnd && value > currentEnd) {
            setCurrentEnd("");
        }
    };

    const addAvailability = () => {
        if (!currentStart || !currentEnd) return;
        if (currentEnd < currentStart) return;

        onChange([...value, { start: currentStart, end: currentEnd }]);
        setCurrentStart("");
        setCurrentEnd("");
    };

    const removeAvailability = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const isValidRange = currentStart && currentEnd && currentStart <= currentEnd;

    useEffect(() => {
        const isValid = value.length > 0;
        if (onValidityChange) onValidityChange(isValid);
    }, [value, onValidityChange]);

    return (
        <>
            <Typography variant="h5" mb={2}>
                Step 2: Add Availability Periods
            </Typography>

            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                <TextField
                    type="date"
                    label="Start"
                    slotProps={{ inputLabel: { shrink: true } }}
                    fullWidth
                    value={currentStart}
                    onChange={(e) => handleStartChange(e.target.value)}
                />

                <TextField
                    type="date"
                    label="End"
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: currentStart } }}
                    fullWidth
                    value={currentEnd}
                    onChange={(e) => setCurrentEnd(e.target.value)}
                />

                <Button variant="contained" onClick={addAvailability} disabled={!isValidRange}>
                    Add
                </Button>
            </Stack>

            <List dense>
                {value.map((a, i) => (
                    <ListItem key={i} secondaryAction={<Button onClick={() => removeAvailability(i)}>Remove</Button>}>
                        <ListItemText primary={`${a.start} → ${a.end}`} />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
