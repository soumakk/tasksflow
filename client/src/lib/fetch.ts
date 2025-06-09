export const API_URL = `${import.meta.env.VITE_SERVER_URL}/api`

export function getUrl(url: string) {
	return `${API_URL}${url}`
}

export async function authFetch<T>(url: string, body?: object, options: RequestInit = {}) {
	const headers = {
		'Content-Type': 'application/json',
		...options.headers,
	}

	return fetch(getUrl(url), {
		...options,
		headers,
		credentials: 'include',
		body: JSON.stringify(body),
	}).then(async (response) => {
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData?.error || `Request failed with status ${response.status}`)
		}
		return response.json() as T
	})
}
