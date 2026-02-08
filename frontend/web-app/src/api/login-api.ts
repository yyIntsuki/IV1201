import { apiFetch } from "./client";

/**
 * Fetches the login API endpoint.
 * @param username 
 * @param password 
 * @returns the role ID of the logged-in user
 */
export const login = async (username: string, password: string): Promise<number> => {
	const query = new URLSearchParams({ username, password }).toString();
	const response = await apiFetch(`/api/v1/users/login?${query}`, { method: "POST" });
	return response;
};