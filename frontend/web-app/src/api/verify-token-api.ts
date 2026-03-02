import apiRequest from "./client";
import type { Account } from "@/types/account";

interface VerifyTokenResponse {
    session_token: string;
    user_id: number;
    account_data: Partial<Account>;
}

/**
 * Verifies a magic link token and retrieves the associated account data.
 * Returns a short-lived session token for completing the account setup.
 *
 * @param {string} token The one-time token from the magic link email
 * @returns {Promise<VerifyTokenResponse>} A promise that resolves with session token and account data
 */
const verifyTokenApi = async (token: string): Promise<VerifyTokenResponse> => {
    return apiRequest<VerifyTokenResponse>("/api/v1/auth/verify-token", { method: "POST", data: { token } });
};

export default verifyTokenApi;
