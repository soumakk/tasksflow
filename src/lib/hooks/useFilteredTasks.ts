import { ITask } from '@/types/tasks'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
	dueDateFilterAtom,
	priorityFilterAtom,
	searchQueryAtom,
	sortFilterAtom,
	statusFilterAtom,
	tagsFilterAtom,
} from '../atoms'

export enum SortBy {
	TitleAsc = 'title-asc',
	TitleDesc = 'title-desc',
	DateAsc = 'last-updated-asc',
	DateDesc = 'last-updated-desc',
}

export default function useFilteredTasks({
	tasks,
	skipSort,
}: {
	tasks: ITask[]
	skipSort?: boolean
}) {
	const searchQuery = useAtomValue(searchQueryAtom)
	const statusFilter = useAtomValue(statusFilterAtom)
	const tagsFilter = useAtomValue(tagsFilterAtom)
	const priorityFilter = useAtomValue(priorityFilterAtom)
	const dueDateFilter = useAtomValue(dueDateFilterAtom)
	const sortFilter = useAtomValue(sortFilterAtom)

	const filteredTasks = useMemo(() => {
		let temp = tasks?.slice()

		if (searchQuery) {
			temp = temp?.filter((task) =>
				task.title?.toLowerCase()?.includes(searchQuery?.trim()?.toLowerCase())
			)
		}

		if (statusFilter?.length) {
			temp = temp?.filter((task) => statusFilter?.includes(task?.status_id))
		}

		if (priorityFilter?.length) {
			temp = temp?.filter((task) => priorityFilter?.includes(task?.priority))
		}

		if (dueDateFilter) {
			temp = temp?.filter((task) => dueDateFilter === task.due_date)
		}

		if (tagsFilter?.length) {
			temp = temp?.filter((task) => tagsFilter?.find((tag) => task.tag_ids?.includes(tag)))
		}

		if (!skipSort) {
			temp = temp?.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
		}

		// if (!skipSort && sortFilter) {
		// 	switch (sortFilter) {
		// 		case SortBy.TitleAsc:
		// 			temp = temp?.sort((a, b) => (a.title > b.title ? 1 : -1))
		// 			break

		// 		case SortBy.TitleDesc:
		// 			temp = temp?.sort((a, b) => (a.title < b.title ? 1 : -1))
		// 			break

		// 		case SortBy.DateAsc:
		// 			temp = temp?.sort((a, b) => (a.updated_at > b.updated_at ? 1 : -1))
		// 			break

		// 		case SortBy.DateDesc:
		// 			temp = temp?.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
		// 			break
		// 	}
		// }

		return temp
	}, [searchQuery, tasks, statusFilter, priorityFilter, tagsFilter, dueDateFilter, skipSort])

	return filteredTasks
}
