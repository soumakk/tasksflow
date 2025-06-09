export const API_ENDPOINTS = {
	login: '/auth/login',
	signup: '/auth/signup',
	me: '/auth/me',
	spaces: '/spaces',
	spaceById: (id: string) => `/spaces/${id}`,
	tasks: (spaceId: string) => `/tasks?spaceId=${spaceId}`,
}
