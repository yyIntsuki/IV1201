import apiRequest from "./client";
import type { Account } from "@/types/account";
import ROLES from "@/constants/roles";

interface RegisterPayload {
    name: string;
    surname: string;
    pnr: string;
    email: string;
    username: string;
    password: string;
    role_id: number;
}

/**
 * Registers a new user account by sending a POST request to the backend API.
 * The payload contains the user's first name, last name, person number, email, username, password, and role.
 * The role is always set to "applicant".
 * 
 * @param account - The user account to register
 * @returns A promise that resolves when the API call is successful
 */
const registerApi = async (account: Account): Promise<void> => {
    const payload: RegisterPayload = {
        name: account.firstName,
        surname: account.lastName,
        pnr: account.personNumber,
        email: account.email,
        username: account.username,
        password: account.password,
        role_id: ROLES.applicant,
    };

    await apiRequest<void>("/api/v1/users", { method: "POST", data: payload });
};

export default registerApi;
