import { MultiDropdown } from '@/components/widgets/MultiDropdown'
import {
	priorityFilterAtom,
	searchQueryAtom,
	selectedRowsAtom,
	statusFilterAtom,
	tagsFilterAtom,
} from '@/lib/atoms'
import { PriorityOptions } from '@/lib/data'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtom, useSetAtom } from 'jotai'
import { CircleCheck, Flag } from 'lucide-react'

export default function TasksFilters() {
	// const setTasks = useSetAtom(tasksAtom)
	const statusList = useLiveQuery(() => db.status.toArray())

	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
	const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom)
	const [tagsFilter, setTagsFilter] = useAtom(tagsFilterAtom)
	const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom)
	const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom)

	if (!statusList) {
		return null
	}

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id,
	}))

	// const tagsOptions = tagsList?.map((tag) => ({
	// 	label: tag.name,
	// 	value: tag.id,
	// }))

	// function deleteRows() {
	// 	setTasks((tasks) => tasks?.filter((task) => !Object.keys(selectedRows)?.includes(task.id)))
	// 	setSelectedRows({})
	// }

	// if (!isEmpty(selectedRows)) {
	// 	return (
	// 		<Button size="sm" variant="outline" onClick={deleteRows}>
	// 			Delete {Object.keys(selectedRows).length} row(s)
	// 		</Button>
	// 	)
	// }

	return (
		<div className="flex border-t border-border">
			<div className="flex items-center gap-3 py-1">
				{/* <Input
					placeholder="Search tasks"
					className="h-8"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/> */}

				<MultiDropdown
					trigger={
						<>
							<CircleCheck className="h-4 w-4" />
							<span>Status</span>
						</>
					}
					options={statusOptions}
					title="status"
					selected={statusFilter}
					onSelect={(selected) => setStatusFilter(selected)}
				/>

				{/* <MultiDropdown
					trigger={
						<>
							<Tag className="h-4 w-4" />
							<span>Tags</span>
						</>
					}
					options={tagsOptions}
					title="tags"
					selected={tagsFilter}
					onSelect={(selected) => setTagsFilter(selected)}
				/> */}

				<MultiDropdown
					trigger={
						<>
							<Flag className="h-4 w-4" />
							<span>Priority</span>
						</>
					}
					options={PriorityOptions}
					title="priority"
					selected={priorityFilter}
					onSelect={(selected) => setPriorityFilter(selected)}
				/>
			</div>
		</div>
	)
}
