import type { ApplicationRecord, ApplicationStatus } from "@/types/application";
import { fetchAvailabilitiesApi, type AvailabilityResponse } from "@/api/fetch-availabilities-api";
import { updateAvailabilityStatusApi, type AvailabilityStatusPayload } from "@/api/update-availability-status-api";
import { fetchUserCompetenceApi, type CompetenceProfileEntry } from "@/api/fetch-user-competence-api";

/**
 * Service to handle recruiter application listing and managing.
 */
const recruiterService = {
    /**
     * Fetch all applications for the recruiter.
     * Maps the availability entries fetched from the API to ApplicationRecord objects
     * @returns A promise that resolves to an array of ApplicationRecord objects
     */
    getApplications: async (): Promise<ApplicationRecord[]> => {
        const data: AvailabilityResponse[] = await fetchAvailabilitiesApi();
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
        const payload: AvailabilityStatusPayload = { status, expected_status: expectedStatus };
        await updateAvailabilityStatusApi(applicationId, payload);
    },

    /**
     * Fetches the competence profile for a specific user.
     * @param userId The ID of the user whose competence profile to fetch.
     * @returns Promise resolving to an array of competence profile entries.
     */
    getUserCompetence: async (userId: number): Promise<CompetenceProfileEntry[]> => {
        return fetchUserCompetenceApi(userId);
    },
};

export default recruiterService;
