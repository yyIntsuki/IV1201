import apiRequest from "./client";

export interface AvailabilityResponse {
    availability_id: number;
    user_id: number;
    name: string;
    surname: string;
    from_date: string;
    to_date: string;
    status: string;
}

/**
 * Fetch all availability entries from the API.
 * Returns a list of AvailabilityResponse objects.
 * 
 * @returns Promise of AvailabilityResponse list
 */
export const fetchAvailabilitiesApi = async (): Promise<AvailabilityResponse[]> => {
    return apiRequest<AvailabilityResponse[]>("/api/v1/availabilities", { method: "GET" });
};
