import apiRequest from "./client";

interface ApplicationPayload {
    user_id: number;
    competence_profile: { competence_id: number; years_of_experience: number }[];
    availability: { from_date: string; to_date: string }[];
}

/**
 * Submits a job application using the given payload.
 *
 * @param payload the application payload containing user_id, competence_profile and availability
 * @returns a promise that resolves to true if the application was submitted successfully, false otherwise
 */
const submitApplicationApi = async (payload: ApplicationPayload): Promise<boolean> => {
    return apiRequest<boolean>("/api/v1/applications", { method: "POST", data: payload });
};

export default submitApplicationApi;
