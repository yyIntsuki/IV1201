import apiRequest from "./client";

export interface ApplicationPayload {
    user_id: number;
    competence_profile: { competence_id: number; years_of_experience: number }[];
    availability: { from_date: string; to_date: string }[];
}

/**
 * Submit a job application.
 */
export const submitApplicationApi = async (payload: ApplicationPayload): Promise<boolean> => {
    return apiRequest<boolean>("/api/v1/applications", { method: "POST", data: payload });
};
