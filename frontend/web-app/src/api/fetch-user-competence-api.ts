import apiRequest from "./client";

export interface CompetenceProfileEntry {
  competence: string;
  years_of_experience: number;
}

/**
 * Fetches the competence profile for a specific user by userId.
 * @param userId The ID of the user whose competence profile to fetch.
 * @returns Promise resolving to an array of competence profile entries.
 */
export async function fetchUserCompetenceApi(userId: number): Promise<CompetenceProfileEntry[]> {
  return apiRequest<CompetenceProfileEntry[]>(`/api/v1/users/${userId}/competence`, { method: "GET" });
}
