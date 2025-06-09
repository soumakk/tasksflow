import { Space } from '@/types/types'
import { authFetch } from '../lib/fetch'
import { API_ENDPOINTS } from './endpoints'

export function getSpaces() {
	return authFetch<Space[]>(API_ENDPOINTS.spaces)
}

export function getTasks(spaceId: string) {
	return authFetch<Space[]>(API_ENDPOINTS.tasks(spaceId))
}
