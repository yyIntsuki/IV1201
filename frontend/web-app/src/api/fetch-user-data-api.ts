import apiRequest from "./client";
import type { Account } from "@/types/account";

/**
 * Fetches the user data for a specific user by userId.
 *
 * @param userId The ID of the user whose data to fetch
 * @returns Promise resolving to the user's data
 */
const fetchUserDataApi = async (userId: number): Promise<Partial<Account>> => {
    return apiRequest<Partial<Account>>(`/api/v1/users/${userId}`, { method: "GET" });
};

export default fetchUserDataApi;
