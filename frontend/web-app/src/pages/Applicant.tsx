import { useState } from "react";
import type { Expertise, Availability } from "../types/application";
import { EXPERTISE_AREAS } from "../constants/expertise-areas";
import { AvailabilityInput } from "../components/applicant/AvailabilityInput";
import { ExpertiseInput } from "../components/applicant/ExpertiseInput";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

const Applicant = () => {
    const [expertiseList, setExpertiseList] = useState<Expertise[]>([]);
    const [availabilityList, setAvailabilityList] = useState<Availability[]>([]);

    const [step, setStep] = useState(1);
    const [isStepValid, setIsStepValid] = useState(false);
    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = () => {
        console.log("Submitting job application:", { expertiseList, availabilityList });
        setStep(4);
    };

    return (
        <Container>
            <Typography variant="h1">Job Application</Typography>
            {step === 1 && (
                <ExpertiseInput
                    value={expertiseList}
                    onChange={setExpertiseList}
                    options={EXPERTISE_AREAS}
                    onValidityChange={setIsStepValid}
                />
            )}

            {step === 2 && (
                <AvailabilityInput
                    value={availabilityList}
                    onChange={setAvailabilityList}
                    onValidityChange={setIsStepValid}
                />
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
                </>
            )}

            {step === 4 && (
                <Box>
                    <Typography variant="h4">Application Submitted!</Typography>
                    <Typography variant="body1">Your job application has been registered successfully.</Typography>
                </Box>
            )}

            <ButtonGroup>
                {step > 1 && step < 4 && <Button onClick={handleBack}>Back</Button>}

                {step < 3 && (
                    <Button variant="contained" onClick={handleNext} disabled={!isStepValid}>
                        Next
                    </Button>
                )}

                {step === 3 && (
                    <Button variant="contained" onClick={handleSubmit} disabled={!isStepValid}>
                        Submit Application
                    </Button>
                )}
            </ButtonGroup>
        </Container>
    );
};

export default Applicant;
