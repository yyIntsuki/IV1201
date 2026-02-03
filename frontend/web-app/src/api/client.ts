export const API_BASE_URL = "http://127.0.0.1:8000";

export const apiFetch = async (path: string) => {
	const response = await fetch(`${API_BASE_URL}${path}`);

	if (!response.ok) {
		throw new Error(`HTTP error ${response.status}`);
	}

	return response.json();
};
