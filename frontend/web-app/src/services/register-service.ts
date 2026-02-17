import type { Account } from "@/types/account";
import registerApi from "@/api/register-api";

const registerService = {
    /**
     * Registers a new account by calling the backend API
     */
    async register(account: Account): Promise<void> {
        await registerApi(account);
    },
};

export default registerService;
