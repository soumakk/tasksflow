import { useQuery } from '@tanstack/react-query'
import { getSpaces, getTasks } from './apis'

export function useSpaces() {
	return useQuery({
		queryKey: ['spaces'],
		queryFn: () => getSpaces(),
	})
}

export function useTasks(spaceId: string) {
	return useQuery({
		queryKey: ['spaces', spaceId, 'tasks'],
		queryFn: () => getTasks(spaceId),
	})
}
