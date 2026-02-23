import type { Account } from "@/types/account";
import registerApi from "@/api/register-api";

/**
 * Service to handle user registration.
 */
const registerService = {
    /**
     * Registers a new user account by sending a POST request to the backend API.
     * The payload contains the user's first name, last name, person number, email, username, password, and role.
     * The role is always set to "applicant".
     * @param account - The user account to register
     * @returns A promise that resolves when the API call is successful
     */
    register: async (account: Account): Promise<void> => {
        await registerApi(account);
    },
};

export default registerService;
