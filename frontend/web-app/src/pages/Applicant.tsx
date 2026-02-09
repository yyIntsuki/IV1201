import { useState } from "react";
import type { Expertise, Availability } from "@/types/application";
import { AvailabilityInput } from "@/components/applicant/AvailabilityInput";
import { ExpertiseInput } from "@/components/applicant/ExpertiseInput";
import { ReviewSummaryList } from "@/components/applicant/ReviewSummaryList";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

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
            {step < 4 && <Typography variant="h1">Job Application</Typography>}

            {step === 1 && (
                <ExpertiseInput value={expertiseList} onChange={setExpertiseList} onValidityChange={setIsStepValid} />
            )}

            {step === 2 && (
                <AvailabilityInput
                    value={availabilityList}
                    onChange={setAvailabilityList}
                    onValidityChange={setIsStepValid}
                />
            )}

            {step === 3 && <ReviewSummaryList expertiseList={expertiseList} availabilityList={availabilityList} />}

            {step === 4 && (
                <>
                    <Typography variant="h2">Application Submitted!</Typography>
                    <Typography variant="body1">Your job application has been registered successfully.</Typography>
                </>
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
