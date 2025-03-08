import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MultiDropdown } from '@/components/widgets/MultiDropdown'
import {
	priorityFilterAtom,
	searchQueryAtom,
	selectedRowsAtom,
	statusAtom,
	statusFilterAtom,
	tagsAtom,
	tagsFilterAtom,
	tasksAtom,
} from '@/lib/atoms'
import { PriorityOptions } from '@/lib/data'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { CircleCheck, Flag, Tag } from 'lucide-react'
import { isEmpty } from 'radash'

export default function TasksFilters() {
	const setTasks = useSetAtom(tasksAtom)
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)

	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
	const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom)
	const [tagsFilter, setTagsFilter] = useAtom(tagsFilterAtom)
	const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom)
	const [selectedRows, setSelectedRows] = useAtom(selectedRowsAtom)

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id,
	}))

	const tagsOptions = tagsList?.map((tag) => ({
		label: tag.name,
		value: tag.id,
	}))

	function deleteRows() {
		setTasks((tasks) => tasks?.filter((task) => !Object.keys(selectedRows)?.includes(task.id)))
		setSelectedRows({})
	}

	if (!isEmpty(selectedRows)) {
		return (
			<Button size="sm" variant="outline" onClick={deleteRows}>
				Delete {Object.keys(selectedRows).length} row(s)
			</Button>
		)
	}

	return (
		<div className="flex items-center gap-3">
			<Input
				placeholder="Search tasks"
				className="h-8"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

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

			<MultiDropdown
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
			/>

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
	)
}
