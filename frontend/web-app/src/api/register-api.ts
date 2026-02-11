import apiRequest from "./client";
import type { Account } from "@/types/account";

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
 * Sends registration data to the backend.
 * @param account
 */
const registerApi = async (account: Account): Promise<void> => {
	const payload: RegisterPayload = {
		name: account.firstName,
		surname: account.lastName,
		pnr: account.personNumber,
		email: account.email,
		username: account.username,
		password: account.password,
		role_id: 2,
	};

	await apiRequest<void>(
		"/api/v1/users",
		{
			method: "POST",
			data: payload,
		}
	);
};

export default registerApi;
