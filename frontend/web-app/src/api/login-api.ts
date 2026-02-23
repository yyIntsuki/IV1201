import apiRequest from "./client";

interface LoginResponse {
    access_token: string;
    token_type: string;
}

/**
 * Logs a user in by making a POST request to /api/v1/login with the provided identifier and password.
 * Returns a Promise that resolves with a LoginResponse object containing the access token and its type.
 * 
 * @param {string} identifier The username or email address of the user
 * @param {string} password The password of the user
 * @returns {Promise<LoginResponse>} A promise that resolves with a LoginResponse object
 */
export const loginApi = async (identifier: string, password: string): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/api/v1/login", { method: "POST", data: { username: identifier, password } });
};

export default loginApi;
