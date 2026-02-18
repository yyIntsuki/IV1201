import apiRequest from "./client";

export interface LoginResponse {
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
const loginApi = async (identifier: string, password: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/api/v1/login", { method: "POST", params: { username: identifier, password } });
};

export default loginApi;
