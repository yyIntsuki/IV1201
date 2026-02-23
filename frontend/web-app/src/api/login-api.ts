import apiRequest from "./client";

interface LoginResponse {
    access_token: string;
    token_type: string;
    role_id: number;
}

/**
 * Fetches the login API endpoint.
 * @param identifier username or email, currently still username as backend expects "username" in JSON
 * @param password
 * @returns login response with JWT and role ID
 */
export const loginApi = async (identifier: string, password: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/api/v1/login", { method: "POST", data: { username: identifier, password } });
};

export default loginApi;
