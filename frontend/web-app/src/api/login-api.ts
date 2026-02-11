import apiRequest from "./client";

export interface LoginResponse {
    access_token: string;
    token_type: string;
    role_id: number;
}

/**
 * Fetches the login API endpoint.
 * @param username
 * @param password
 * @returns login response with JWT and role ID
 */
const loginApi = async (
    username: string,
    password: string,
): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>(
        "/api/v1/login",
        {
            method: "POST",
            params: { username, password },
        }
    );
};

export default loginApi;
