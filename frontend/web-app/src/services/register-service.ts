import type { Account } from "@/types/account";
import registerApi from "@/api/register-api";

const registerService = {
    /**
     * Registers a new account by calling the backend API
     */
    register: async (account: Account) => {
        try {
            await registerApi(account);
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            throw new Error(`Registration failed. Reason: ${message}`);
        }
    },
};

export default registerService;
