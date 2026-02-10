import type { RegisterData } from "@/types/account";

const STORAGE_KEY = "local_accounts";

const registerService = {
    /**
     * Registers a new account in localStorage
     */
    register: async (account: RegisterData) => {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existing = localStorage.getItem(STORAGE_KEY);
        const accounts: RegisterData[] = existing ? JSON.parse(existing) : [];

        accounts.push(account);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    },
};

export default registerService;
