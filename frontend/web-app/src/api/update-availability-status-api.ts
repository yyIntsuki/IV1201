import apiRequest from "./client";

export interface AvailabilityStatusPayload {
    status: "accepted" | "rejected" | "unhandled";
    expected_status: "accepted" | "rejected" | "unhandled";
}

/**
 * Update availability status by id.
 */
export const updateAvailabilityStatusApi = async (
    availabilityId: number,
    payload: AvailabilityStatusPayload,
): Promise<boolean> => {
    return apiRequest<boolean>(`/api/v1/availabilities/${availabilityId}/status`, { method: "POST", data: payload });
};
