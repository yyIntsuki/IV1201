import type { ApplicationSubmission } from "@/types/application";
import { submitApplicationApi, type ApplicationPayload } from "@/api/submit-application-api";
import CompetenceParser from "@/utils/competence-parser";

/**
 * Converts the submission data from frontend to be backend-compatible.
 * @param data the submission data for the application from Applicant page
 * @returns the corresponding payload for API use
 */
const toApiPayload = (data: ApplicationSubmission): ApplicationPayload => ({
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
     * Submits a new application by calling the backend API.
     */
    submitApplication: async (data: ApplicationSubmission): Promise<void> => {
        await submitApplicationApi(toApiPayload(data));
    },
};

export default applicantService;
