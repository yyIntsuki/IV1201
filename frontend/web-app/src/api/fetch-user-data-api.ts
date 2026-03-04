import apiRequest from "./client";
import type { Account } from "@/types/account";

interface UserDataResponse {
    user_data: Partial<Account>;
}

/**
 * Fetches the user data for a specific user by userId.
 * @param userId The ID of the user whose data to fetch.
 * @returns Promise resolving to the user's data.
 */
const fetchUserDataApi = async (userId: number): Promise<UserDataResponse> => {
    return apiRequest<UserDataResponse>(`/api/v1/users/${userId}`, { method: "GET" });
};

export default fetchUserDataApi;
