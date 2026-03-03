import verifyTokenApi from "@/api/verify-token-api";
import completeAccountApi from "@/api/complete-account-api";
import STORAGE_KEYS from "@/constants/storage-keys";
import type { Account } from "@/types/account";

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
        const response = await verifyTokenApi(token);

        sessionStorage.setItem(STORAGE_KEYS.COMPLETION_TOKEN, response.session_token);
        sessionStorage.setItem(STORAGE_KEYS.COMPLETION_UID, response.user_id.toString());

        return response.account_data;
    },

    /**
     * Completes the user's account with the provided data.
     * Uses the session token from verifyToken and stores the final auth token.
     *
     * @param {Partial<Account>} accountData The data to complete the account with
     */
    completeAccount: async (accountData: Partial<Account>): Promise<void> => {
        const sessionToken = sessionStorage.getItem(STORAGE_KEYS.COMPLETION_TOKEN);

        if (!sessionToken) throw new Error("No session token found. Please restart the account completion process.");

        const response = await completeAccountApi(accountData, sessionToken);

        localStorage.setItem(STORAGE_KEYS.TOKEN, response.access_token);

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
