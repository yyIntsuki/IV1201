import verifyTokenApi from "@/api/verify-token-api";
import fetchUserDataApi from "@/api/fetch-user-data-api";
import userUpdateApi from "@/api/update-user-api";
import STORAGE_KEYS from "@/constants/storage-keys";
import type { Account } from "@/types/account";
import { getUserIdFromJwt } from "@/utils/jwt-decoder";

/**
 * Account completion service to handle the account setup flow.
 */
const completeAccountService = {
    /**
     * Verifies a magic link token and retrieves account data.
     * Stores the session token temporarily for the completion process.
     *
     * @param {string} token The one-time token from the magic link
     * @returns {Promise<Partial<Account>>} The account data with existing values
     */
    verifyToken: async (token: string): Promise<Partial<Account>> => {
        const loginResponse = await verifyTokenApi(token);

        sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, loginResponse.access_token);
        sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, loginResponse.user_id.toString());

        return await fetchUserDataApi(loginResponse.user_id);
    },

    /**
     * Initializes the completion session for a logged-in user and retrieves their data.
     *
     * @param {string} token The current authentication token
     * @returns {Promise<Partial<Account>>} The account data
     */
    getAccountDataForLoggedInUser: async (token: string): Promise<Partial<Account>> => {
        const userId = getUserIdFromJwt(token);
        if (!userId) throw new Error("Invalid session. Please log in again.");

        sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, token);
        sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, userId.toString());

        return await fetchUserDataApi(userId);
    },

    /**
     * Completes the user's account with the provided data.
     * Uses the session token from verifyToken and stores the final auth token.
     *
     * @param {Partial<Account>} accountData The data to complete the account with
     */
    completeAccount: async (accountData: Partial<Account>): Promise<void> => {
        const sessionToken = sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN);
        const userId = sessionStorage.getItem(STORAGE_KEYS.COMPLETION_UID);

        if (!sessionToken || !userId)
            throw new Error("No session token or user ID found. Please restart the account completion process.");

        const parsedUserId = Number(userId);
        if (!Number.isFinite(parsedUserId))
            throw new Error("Invalid user ID. Please restart the account completion process.");

        const success = await userUpdateApi(accountData, sessionToken, parsedUserId);
        if (!success) throw new Error("Failed to update account. Please try again.");

        /* Elevate the token once account is completed */
        localStorage.setItem(STORAGE_KEYS.TOKEN, sessionToken);

        sessionStorage.removeItem(STORAGE_KEYS.COMPLETION_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.COMPLETION_UID);
    },

    /**
     * Cleans up any stored session data.
     */
    clearSession: (): void => {
        sessionStorage.removeItem(STORAGE_KEYS.COMPLETION_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.COMPLETION_UID);
    },
};

export default completeAccountService;
