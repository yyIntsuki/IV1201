import apiRequest from "./client";
import type { Account } from "@/types/account";

interface CompleteAccountResponse {
    access_token: string;
    token_type: string;
}

/**
 * Completes a user's account by filling in missing information.
 * Requires a valid session token from the verify-token endpoint.
 * Returns a full authentication token upon successful completion.
 *
 * @param {Partial<Account>} accountData The account data to update
 * @param {string} sessionToken The short-lived session token from verify-token
 * @returns {Promise<CompleteAccountResponse>} A promise that resolves with authentication token
 */
const completeAccountApi = async (
    accountData: Partial<Account>,
    sessionToken: string,
): Promise<CompleteAccountResponse> => {
    return apiRequest<CompleteAccountResponse>("/api/v1/users/complete", {
        method: "PATCH",
        data: accountData,
        headers: { Authorization: `Bearer ${sessionToken}` },
    });
};

export default completeAccountApi;
