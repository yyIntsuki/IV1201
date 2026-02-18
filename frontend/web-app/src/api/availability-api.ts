import apiRequest from "./client";

export interface AvailabilityResponse {
    user_id: number;
    name: string;
    surname: string;
    from_date: string;
    to_date: string;
}

/**
 * Fetch all availability entries.
 */
const fetchAvailabilities = async (): Promise<AvailabilityResponse[]> => {
    return apiRequest<AvailabilityResponse[]>("/api/v1/availabilities", { method: "GET" });
};

export default fetchAvailabilities;
