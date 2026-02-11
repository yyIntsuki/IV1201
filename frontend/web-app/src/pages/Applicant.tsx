import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Competence, Availability } from "@/types/application";
import AvailabilityInput from "@/components/applicant/AvailabilityInput";
import CompetenceInput from "@/components/applicant/CompetenceInput";
import ReviewSummaryList from "@/components/applicant/ReviewSummaryList";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

const Applicant = () => {
    const [competenceList, setCompetenceList] = useState<Competence[]>([]);
    const [availabilityList, setAvailabilityList] = useState<Availability[]>([]);

    const [step, setStep] = useState(1);
    const [isStepValid, setIsStepValid] = useState(false);
    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const { t } = useTranslation();

    const handleSubmit = () => {
        console.log("Submitting job application:", { competenceList, availabilityList });
        setStep(4);
    };

    return (
        <>
            <Card sx={{ display: "inline-block", p: 2 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {step < 4 && <Typography variant="h1">{t("applicant.applicationForm.title")}</Typography>}

                    {step === 1 && (
                        <CompetenceInput
                            value={competenceList}
                            onChange={setCompetenceList}
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
                        <ReviewSummaryList competenceList={competenceList} availabilityList={availabilityList} />
                    )}

                    {step === 4 && (
                        <>
                            <Typography variant="h2">{t("applicant.applicationForm.submitted.title")}</Typography>
                            <Typography variant="body1">{t("applicant.applicationForm.submitted.message")}</Typography>
                        </>
                    )}

                    <ButtonGroup sx={{ display: "flex", justifyContent: "flex-end" }}>
                        {step > 1 && step < 4 && (
                            <Button onClick={handleBack}>{t("applicant.applicationForm.back")}</Button>
                        )}

                        {step < 3 && (
                            <Button variant="contained" onClick={handleNext} disabled={!isStepValid}>
                                {t("applicant.applicationForm.next")}
                            </Button>
                        )}

                        {step === 3 && (
                            <Button variant="contained" onClick={handleSubmit} disabled={!isStepValid}>
                                {t("applicant.applicationForm.submit")}
                            </Button>
                        )}
                    </ButtonGroup>
                </CardContent>
            </Card>
        </>
    );
};

export default Applicant;
