import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export function useTasks() {
	const tasks = useLiveQuery(() => db.tasks.toArray())
	return {
		tasksList: tasks,
		isTasksLoading: !tasks,
	}
}

export function useStatus() {
	const status = useLiveQuery(() => db.status.toArray())
	return {
		statusList: status,
		isStatusLoading: !status,
	}
}

export function useTags() {
	const tags = useLiveQuery(() => db.tags.toArray())
	return {
		tagsList: tags,
		isTagsLoading: !tags,
	}
}
