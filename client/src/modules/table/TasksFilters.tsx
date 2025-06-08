import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/widgets/DatePicker'
import { MultiDropdown } from '@/components/widgets/MultiDropdown'
import {
	dueDateFilterAtom,
	priorityFilterAtom,
	searchQueryAtom,
	statusFilterAtom,
	tagsFilterAtom,
} from '@/lib/atoms'
import { PriorityOptions } from '@/lib/data'
import { useStatus, useTags } from '@/lib/hooks/dexie'
import { useAtom } from 'jotai'
import { Disc, Flag, Search, Tag } from 'lucide-react'

export default function TasksFilters() {
	const { statusList, isStatusLoading } = useStatus()
	const { tagsList, isTagsLoading } = useTags()

	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
	const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom)
	const [tagsFilter, setTagsFilter] = useAtom(tagsFilterAtom)
	const [priorityFilter, setPriorityFilter] = useAtom(priorityFilterAtom)
	const [dueDateFilter, setDueDateFilter] = useAtom(dueDateFilterAtom)

	if (isStatusLoading || isTagsLoading) {
		return null
	}

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id,
	}))

	const tagsOptions = tagsList?.map((tag) => ({
		label: tag.name,
		value: tag.id,
	}))

	return (
		<div className="flex items-center gap-3 py-1">
			<Input
				placeholder="Search tasks"
				className="h-8 rounded-full"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
			/>

			<MultiDropdown
				trigger={
					<>
						<Disc className="h-4 w-4 text-muted-foreground" />
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
						<Tag className="h-4 w-4 text-muted-foreground" />
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
						<Flag className="h-4 w-4 text-muted-foreground" />
						<span>Priority</span>
					</>
				}
				options={PriorityOptions}
				title="priority"
				selected={priorityFilter}
				onSelect={(selected) => setPriorityFilter(selected)}
				hideSearch
			/>

			<DatePicker id="date" value={dueDateFilter} onChange={setDueDateFilter} />
		</div>
	)
}
