import type { Account } from "@/types/account";

const STORAGE_KEY = "local_accounts";

const registerService = {
    /**
     * Registers a new account in localStorage
     */
    register: async (account: Account) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existing = localStorage.getItem(STORAGE_KEY);
        const accounts: Account[] = existing ? JSON.parse(existing) : [];

        accounts.push(account);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    },
};

export default registerService;
