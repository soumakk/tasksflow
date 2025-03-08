import { Input } from '@/components/ui/input'
import { MultiDropdown } from '@/components/widgets/MultiDropdown'
import {
	priorityFilterAtom,
	searchQueryAtom,
	statusAtom,
	statusFilterAtom,
	tagsAtom,
	tagsFilterAtom,
} from '@/lib/atoms'
import { PriorityOptions } from '@/lib/data'
import { useAtom, useAtomValue } from 'jotai'
import { CircleCheck, Flag, Tag } from 'lucide-react'

export default function TasksFilters() {
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)

	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
	const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom)
	const [tagsFilter, setTagsFilter] = useAtom(tagsFilterAtom)
	const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom)

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id,
	}))

	const tagsOptions = tagsList?.map((tag) => ({
		label: tag.name,
		value: tag.id,
	}))

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
