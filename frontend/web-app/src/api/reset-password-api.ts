import apiRequest from "./client";

interface ResetPasswordResponse {
    message: string;
}

/**
 * Requests access for users without passwords by sending a magic link to their email.
 * Makes a POST request to /api/v1/auth/reset-password with the provided identifier.
 *
 * @param {string} identifier The email address or person number of the user
 * @returns {Promise<ResetPasswordResponse>} A promise that resolves with a success message
 */
const resetPasswordApi = async (identifier: string): Promise<ResetPasswordResponse> => {
    return apiRequest<ResetPasswordResponse>("/api/v1/auth/reset-password", { method: "POST", data: { identifier } });
};

export default resetPasswordApi;
