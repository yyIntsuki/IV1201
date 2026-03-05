import apiRequest from "./client";

interface UserCompetenceResponse {
    competence: string;
    years_of_experience: number;
}

/**
 * Fetches the competence profile for a specific user by userId.
 *
 * @param userId The ID of the user whose competence profile to fetch
 * @returns Promise resolving to an array of competence profile entries
 */
const fetchUserCompetenceApi = async (userId: number): Promise<UserCompetenceResponse[]> => {
    return apiRequest<UserCompetenceResponse[]>(`/api/v1/competence/${userId}`, { method: "GET" });
};

export default fetchUserCompetenceApi;
