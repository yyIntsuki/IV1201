import { apiFetch } from "./client";

export const healthCheck = () => {
	return apiFetch("/health");
};
