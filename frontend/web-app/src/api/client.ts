const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Base API fetch client.
 * @param path the API path to fetch from
 * @param options the fetch options to use
 * @returns the JSON response from the API
 */
export const apiFetch = async (
	path: string,
	options?: RequestInit,
) => {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { "Content-Type": "application/json" },
		...options
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || `HTTP error ${response.status}`);
	}

	return response.json();
};
