import apiRequest from "./client";

export interface AvailabilityStatusPayload {
    status: "accepted" | "rejected" | "unhandled";
    expected_status: "accepted" | "rejected" | "unhandled";
}

/**
 * Updates the status of an availability entry.
 * 
 * @param availabilityId the ID of the availability entry
 * @param payload the payload containing the new status and the expected status
 * @returns a promise that resolves to true if the status was updated successfully, false otherwise
 */
export const updateAvailabilityStatusApi = async (
    availabilityId: number,
    payload: AvailabilityStatusPayload,
): Promise<boolean> => {
    return apiRequest<boolean>(`/api/v1/availabilities/${availabilityId}/status`, { method: "POST", data: payload });
};
