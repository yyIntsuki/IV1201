import type { ApplicationSubmission } from "@/types/application";
import submitApplicationApi from "@/api/submit-application-api";
import CompetenceParser from "@/utils/competence-parser";

/**
 * Maps an ApplicationSubmission object to an ApplicationPayload object.
 * This function is used to correctly format the submission data for the API.
 * @param data the submission data for the application from Applicant page
 * @returns an ApplicationPayload object containing user_id, competence_profile and availability
 */
const toApiPayload = (data: ApplicationSubmission) => ({
    user_id: data.userId,
    competence_profile: data.competenceProfile.map((c) => ({
        competence_id: CompetenceParser.competenceToId(c.competence),
        years_of_experience: c.yearsOfExperience,
    })),
    availability: data.availability.map((a) => ({ from_date: a.fromDate, to_date: a.toDate })),
});

/**
 * Service to handle applicant application submission.
 */
const applicantService = {
    /**
     * Submits a job application using the given payload.
     * @param data the submission data for the application from Applicant page
     * @returns a promise that resolves to void if the submission was successful
     */
    submitApplication: async (data: ApplicationSubmission): Promise<void> => {
        await submitApplicationApi(toApiPayload(data));
    },
};

export default applicantService;
