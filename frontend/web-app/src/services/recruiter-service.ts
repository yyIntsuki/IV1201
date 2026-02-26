import type { ApplicationRecord, ApplicationStatus, CompetenceEntry } from "@/types/application";
import fetchAvailabilitiesApi from "@/api/fetch-availabilities-api";
import updateAvailabilityStatusApi from "@/api/update-availability-status-api";
import fetchUserCompetenceApi from "@/api/fetch-user-competence-api";
import CompetenceParser from "@/utils/competence-parser";

/**
 * Service to handle recruiter application listing and managing.
 */
const recruiterService = {
    /**
     * Fetch all applications for the recruiter.
     * Maps the availability entries fetched from the API to ApplicationRecord objects.
     *
     * @returns A promise that resolves to an array of ApplicationRecord objects
     */
    getApplications: async (): Promise<ApplicationRecord[]> => {
        const data = await fetchAvailabilitiesApi();
        return data.map((item) => ({
            applicationId: item.availability_id,
            userId: item.user_id,
            fullName: `${item.name} ${item.surname}`,
            status: item.status as ApplicationStatus,
            competenceProfile: [],
            availability: [{ fromDate: item.from_date, toDate: item.to_date }],
        }));
    },

    /**
     * Update the status of an application entry.
     *
     * @param {number} applicationId - Application ID to update
     * @param {ApplicationStatus} status - New status to set
     * @param {ApplicationStatus} expectedStatus - Expected status of the application entry before update
     * @returns A promise that resolves to void when the status is updated successfully
     */
    setApplicationStatus: async (
        applicationId: number,
        status: ApplicationStatus,
        expectedStatus: ApplicationStatus,
    ): Promise<void> => {
        await updateAvailabilityStatusApi(applicationId, { status, expected_status: expectedStatus });
    },

    /**
     * Fetches the competence profile for a specific user by userId.
     *
     * @param userId The ID of the user whose competence profile to fetch
     * @returns Promise resolving to an array of competence profile entries
     * @throws Error if an unknown competence is received from the API
     */
    getUserCompetence: async (userId: number): Promise<CompetenceEntry[]> => {
        const data = await fetchUserCompetenceApi(userId);
        return data.map((item) => {
            if (!CompetenceParser.isValidCompetence(item.competence)) {
                throw new Error(`Unknown competence received from API: "${item.competence}"`);
            }
            return { competence: item.competence, yearsOfExperience: item.years_of_experience };
        });
    },
};

export default recruiterService;
