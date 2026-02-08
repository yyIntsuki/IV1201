import { useState } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

const expertiseOptions = ["ticket sales", "lotteries", "roller coaster operation"];

interface Expertise {
    area: string;
    years: number;
}

interface Availability {
    start: string;
    end: string;
}

const Applicant = () => {
    const [step, setStep] = useState(1);

    const [expertiseList, setExpertiseList] = useState<Expertise[]>([]);
    const [availabilityList, setAvailabilityList] = useState<Availability[]>([]);

    const [currentArea, setCurrentArea] = useState("");
    const [currentYears, setCurrentYears] = useState(1);
    const [currentStart, setCurrentStart] = useState("");
    const [currentEnd, setCurrentEnd] = useState("");

    const addExpertise = () => {
        if (currentArea && currentYears > 0) {
            setExpertiseList([...expertiseList, { area: currentArea, years: currentYears }]);
            setCurrentArea("");
            setCurrentYears(1);
        }
    };

    const removeExpertise = (area: string) => {
        setExpertiseList(expertiseList.filter((exp) => exp.area !== area));
    };

    const addAvailability = () => {
        if (currentStart && currentEnd) {
            setAvailabilityList([...availabilityList, { start: currentStart, end: currentEnd }]);
            setCurrentStart("");
            setCurrentEnd("");
        }
    };

    const removeAvailability = (index: number) => {
        setAvailabilityList(availabilityList.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        console.log("Submitting job application:", { expertiseList, availabilityList });
        setStep(4);
    };

    return (
        <Container>
            {step === 1 && (
                <>
                    <Typography variant="h5" mb={2}>
                        Step 1: Add Areas of Expertise
                    </Typography>

                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                        <Select
                            fullWidth
                            value={currentArea}
                            onChange={(e) => setCurrentArea(e.target.value)}
                            displayEmpty>
                            <MenuItem value="" disabled>
                                Select area
                            </MenuItem>
                            {expertiseOptions
                                .filter((area) => !expertiseList.some((exp) => exp.area === area))
                                .map((area) => (
                                    <MenuItem key={area} value={area}>
                                        {area}
                                    </MenuItem>
                                ))}
                        </Select>

                        <TextField
                            type="number"
                            label="Years"
                            value={currentYears}
                            slotProps={{ htmlInput: { min: 1 } }}
                            onChange={(e) => setCurrentYears(Number(e.target.value))}
                        />

                        <Button variant="contained" onClick={addExpertise} disabled={!currentArea}>
                            Add
                        </Button>
                    </Stack>

                    <List>
                        {expertiseList.map((exp, i) => (
                            <ListItem key={i}>
                                <ListItemText primary={`${exp.area} — ${exp.years} years`} />
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => removeExpertise(exp.area)}>
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Button variant="contained" onClick={() => setStep(2)} disabled={expertiseList.length === 0}>
                        Next: Availability
                    </Button>
                </>
            )}

            {step === 2 && (
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
                            onChange={(e) => setCurrentStart(e.target.value)}
                        />

                        <TextField
                            type="date"
                            label="End"
                            slotProps={{ inputLabel: { shrink: true } }}
                            fullWidth
                            value={currentEnd}
                            onChange={(e) => setCurrentEnd(e.target.value)}
                        />

                        <Button variant="contained" onClick={addAvailability} disabled={!currentStart || !currentEnd}>
                            Add
                        </Button>
                    </Stack>

                    <List>
                        {availabilityList.map((a, i) => (
                            <ListItem
                                key={i}
                                secondaryAction={
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeAvailability(i)}>
                                        Remove
                                    </Button>
                                }>
                                <ListItemText primary={`${a.start} → ${a.end}`} />
                            </ListItem>
                        ))}
                    </List>

                    <ButtonGroup>
                        <Button variant="outlined" onClick={() => setStep(1)}>
                            Back
                        </Button>

                        <Button variant="contained" onClick={() => setStep(3)} disabled={availabilityList.length === 0}>
                            Next: Review
                        </Button>
                    </ButtonGroup>
                </>
            )}

            {step === 3 && (
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

                    <ButtonGroup>
                        <Button variant="outlined" onClick={() => setStep(2)}>
                            Back
                        </Button>
                        <Button variant="contained" onClick={handleSubmit}>
                            Submit Application
                        </Button>
                    </ButtonGroup>
                </>
            )}

            {step === 4 && (
                <Box>
                    <Typography variant="h4">Application Submitted!</Typography>
                    <Typography variant="body1">Your job application has been registered successfully.</Typography>
                </Box>
            )}
        </Container>
    );
};

export default Applicant;
