import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/widgets/DataTable'
import { priorityFilterAtom, searchQueryAtom, statusFilterAtom, tagsFilterAtom } from '@/lib/atoms'
import { ColumnDef } from '@tanstack/react-table'
import { useAtomValue } from 'jotai'
import { Flag } from 'lucide-react'
import { useMemo } from 'react'
import { cn, formatDate } from '../lib/utils'
import { IStatus, ITag, ITask, TaskPriority } from '../types/tasks'
import { Checkbox } from '@/components/ui/checkbox'

export default function TableView({
	tasks,
	isTasksLoading,
	onViewTask,
	statusList,
	tagsList,
}: {
	tasks: ITask[]
	isTasksLoading?: boolean
	onViewTask: (task: ITask) => void
	statusList: IStatus[]
	tagsList: ITag[]
}) {
	const searchQuery = useAtomValue(searchQueryAtom)
	const statusFilter = useAtomValue(statusFilterAtom)
	const tagsFilter = useAtomValue(tagsFilterAtom)
	const priorityFilter = useAtomValue(priorityFilterAtom)

	const columns: ColumnDef<ITask>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={Boolean(
						table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && 'indeterminate')
					)}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<div className="min-w-6 flex items-center" onClick={(e) => e.stopPropagation()}>
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
			size: 50,
			enableResizing: false,
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ getValue }) => {
				const value = getValue() as string
				if (!value) return null
				return <p className="whitespace-nowrap">{value}</p>
			},
		},
		{
			accessorKey: 'description',
			header: 'Description',
			cell: ({ getValue }) => {
				const value = getValue() as string
				if (!value) return null
				return <p className="whitespace-nowrap">{value}</p>
			},
		},
		{
			accessorKey: 'priority',
			header: 'Priority',
			cell: ({ getValue }) => {
				const priority = getValue() as TaskPriority
				if (!priority) return null
				return (
					<p className="capitalize text-sm flex items-center gap-2">
						<Flag
							className={cn('h-4 w-4', {
								'stroke-red-500': priority === TaskPriority.Urgent,
								'stroke-yellow-500': priority === TaskPriority.High,
								'stroke-blue-500': priority === TaskPriority.Normal,
								'stroke-gray-500': priority === TaskPriority.Low,
							})}
						/>
						{priority}
					</p>
				)
			},
		},
		{
			accessorKey: 'status_id',
			header: 'Status',
			cell: ({ getValue }) => {
				const statusId = getValue() as string
				if (!statusId) return null
				const statusInfo = statusList?.find((opt) => opt.id === statusId)
				return statusInfo ? (
					<Badge
						className="text-black"
						style={{
							backgroundColor: statusInfo?.color,
						}}
					>
						{statusInfo?.name}
					</Badge>
				) : null
			},
		},
		{
			accessorKey: 'tag_ids',
			header: 'Tags',
			cell: ({ getValue }) => {
				const tagIds = getValue() as string[]
				if (!tagIds?.length) return null
				const tags = tagsList?.filter((opt) => tagIds?.includes(opt.id))
				return tags ? (
					<div className="flex gap-1">
						{tags?.slice(0, 3)?.map((tag) => (
							<Badge variant="outline" key={tag.id}>
								{tag.name}
							</Badge>
						))}
					</div>
				) : null
			},
		},
		{
			accessorKey: 'due_date',
			header: 'Date',
			cell: ({ getValue }) => {
				const date = getValue() as string
				if (!date) return null
				return <p className="whitespace-nowrap">{formatDate(date)}</p>
			},
		},
		{
			accessorKey: 'updated_at',
			header: 'Last updated',
			cell: ({ getValue }) => {
				const updated = getValue() as string
				if (!updated) return null
				return (
					<p className="whitespace-nowrap">
						{formatDate(updated, 'MMM DD, YYYY HH:mm a')}
					</p>
				)
			},
		},
	]

	const filteredTasks = useMemo(() => {
		let temp = [...tasks]

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

		if (tagsFilter?.length) {
			temp = temp?.filter((task) => tagsFilter?.find((tag) => task.tag_ids?.includes(tag)))
		}

		return temp
	}, [searchQuery, tasks, statusFilter, priorityFilter, tagsFilter])

	return (
		<DataTable
			columns={columns}
			data={filteredTasks}
			isLoading={isTasksLoading}
			onRowClick={(row) => onViewTask(row.original)}
		/>
	)
}
