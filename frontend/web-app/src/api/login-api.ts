import apiRequest from "./client";

/**
 * Fetches the login API endpoint.
 * @param username
 * @param password
 * @returns the role ID of the logged-in user (1 or 2)
 */
const loginApi = async (
    username: string,
    password: string,
): Promise<number> => {
    return apiRequest<number>(
        "/api/v1/users/login",
        {
            method: "POST",
            params: { username, password },
        }
    );
};

export default loginApi;
