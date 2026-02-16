import apiRequest from "./client";

export interface ApplicationPayload {
    user_id: number;
    competence_profile: Array<{
        competence_id: number;
        years_of_experience: number;
    }>;
    availability: Array<{
        from_date: string;
        to_date: string;
    }>;
}

/**
 * Submit a job application.
 */
const submitApplication = async (payload: ApplicationPayload): Promise<boolean> => {
    return apiRequest<boolean>("/api/v1/applications", {
        method: "POST",
        data: payload,
    });
};

export default submitApplication;
