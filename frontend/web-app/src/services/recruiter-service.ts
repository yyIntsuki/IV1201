import type { ApplicationRecord, ApplicationStatus } from "@/types/application";
import { fetchAvailabilitiesApi, type AvailabilityResponse } from "@/api/fetch-availabilities-api";
import { updateAvailabilityStatusApi, type AvailabilityStatusPayload } from "@/api/update-availability-status-api";

/**
 * Service to handle recruiter application listing and managing.
 */
const recruiterService = {
    /**
     * Fetch all applications.
     */
    async getApplications(): Promise<ApplicationRecord[]> {
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
     * Update status of an application.
     */
    async setApplicationStatus(applicationId: number, status: ApplicationStatus, expectedStatus: ApplicationStatus): Promise<void> {
        const payload: AvailabilityStatusPayload = { status, expected_status: expectedStatus };
        await updateAvailabilityStatusApi(applicationId, payload);
    },
};

export default recruiterService;
