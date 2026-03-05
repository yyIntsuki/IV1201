import apiRequest from "./client";
import type { Account } from "@/types/account";

/**
 * Completes a user's account by filling in missing information.
 * Requires a valid session token from the verify-token endpoint.
 * Returns a full authentication token upon successful completion.
 *
 * @param {Partial<Account>} accountData The account data to update
 * @param {string} sessionToken The short-lived session token from verify-token
 * @param {number} userId The ID of the user to update
 * @returns {Promise<boolean>} A promise that resolves with true on success
 */
const userUpdateApi = async (accountData: Partial<Account>, sessionToken: string, userId: number): Promise<boolean> => {
    await apiRequest(`/api/v1/users/${userId}`, {
        method: "PUT",
        data: {
            name: accountData.firstName,
            surname: accountData.lastName,
            pnr: accountData.personNumber,
            email: accountData.email,
            username: accountData.username,
        },
        headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return true;
};

export default userUpdateApi;
