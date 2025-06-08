export const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`

export function getUrl(url: string) {
	return `${API_URL}${url}`
}

export async function authFetch<T>(url: string, options: RequestInit = {}) {
	const headers = {
		'Content-Type': 'application/json',
		// Authorization: `Bearer ${token}`,
		...options.headers,
	}

	return fetch(`${API_URL}${url}`, {
		...options,
		headers,
	}).then(async (response) => {
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData?.error || `Request failed with status ${response.status}`)
		}
		return response.json() as T
	})
}
