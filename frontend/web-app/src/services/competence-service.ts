import { fetchUserCompetenceApi, type CompetenceProfileEntry } from "@/api/fetch-user-competence-api";

const competenceService = {
  /**
   * Fetches the competence profile for a specific user.
   * @param userId The ID of the user whose competence profile to fetch.
   * @returns Promise resolving to an array of competence profile entries.
   */
  getUserCompetence: async (userId: number): Promise<CompetenceProfileEntry[]> => {
    return fetchUserCompetenceApi(userId);
  },
};

export default competenceService;
