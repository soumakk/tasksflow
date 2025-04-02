import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import DataTable from '@/components/widgets/DataTable'
import { priorityFilterAtom, searchQueryAtom, statusFilterAtom, tagsFilterAtom } from '@/lib/atoms'
import { db } from '@/lib/db'
import { ColumnDef } from '@tanstack/react-table'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtomValue } from 'jotai'
import { Flag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn, formatDate } from '../lib/utils'
import { IStatus, ITag, ITask, TaskPriority } from '../types/tasks'
import EditableCell from './EditableCell'
import Select from '@/components/widgets/Select'
import PriorityEditField from './PriorityEditField'

export default function TableView({
	onViewTask,
	statusList,
	tagsList,
}: {
	onViewTask?: (task: ITask) => void
	statusList: IStatus[]
	tagsList: ITag[]
}) {
	const searchQuery = useAtomValue(searchQueryAtom)
	const statusFilter = useAtomValue(statusFilterAtom)
	const tagsFilter = useAtomValue(tagsFilterAtom)
	const priorityFilter = useAtomValue(priorityFilterAtom)
	const [editingCell, setEditingCell] = useState(null)
	const tasks = useLiveQuery(() => db.tasks.toArray())

	async function updateCell(id: string, key: string, value: string) {
		const task = tasks.find((t) => t.id === id)
		await db.tasks.update(id, { ...task, [key]: value })
	}

	console.log(tasks)

	const columns: ColumnDef<ITask>[] = [
		// {
		// 	id: 'select',
		// 	header: ({ table }) => (
		// 		<Checkbox
		// 			checked={Boolean(
		// 				table.getIsAllPageRowsSelected() ||
		// 					(table.getIsSomePageRowsSelected() && 'indeterminate')
		// 			)}
		// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
		// 			aria-label="Select all"
		// 		/>
		// 	),
		// 	cell: ({ row }) => (
		// 		<div className="min-w-6 flex items-center" onClick={(e) => e.stopPropagation()}>
		// 			<Checkbox
		// 				checked={row.getIsSelected()}
		// 				onCheckedChange={(value) => row.toggleSelected(!!value)}
		// 				aria-label="Select row"
		// 			/>
		// 		</div>
		// 	),
		// 	enableSorting: false,
		// 	enableHiding: false,
		// 	size: 50,
		// 	enableResizing: false,
		// },
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ getValue, row, column }) => {
				const isEditing = editingCell?.row === row?.id && editingCell?.col === column?.id
				const value = getValue() as string
				if (isEditing) {
					return (
						<EditableCell
							onSave={(value) => {
								updateCell(row?.id, column?.id, value)
								setEditingCell(null)
							}}
							initialValue={value}
						/>
					)
				}
				return (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<p className="whitespace-nowrap">{value}</p>
					</div>
				)
			},
			size: 200,
		},
		{
			accessorKey: 'description',
			header: 'Description',
			cell: ({ getValue, row, column }) => {
				const isEditing = editingCell?.row === row?.id && editingCell?.col === column?.id
				const value = getValue() as string
				if (isEditing) {
					return (
						<EditableCell
							onSave={(value) => {
								updateCell(row?.id, column?.id, value)
								setEditingCell(null)
							}}
							initialValue={value}
						/>
					)
				}
				return (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<p className="whitespace-nowrap">{value}</p>
					</div>
				)
			},
			size: 300,
		},
		{
			accessorKey: 'priority',
			header: 'Priority',
			cell: ({ getValue, row, column }) => {
				const priority = getValue() as TaskPriority
				const isEditing = editingCell?.row === row?.id && editingCell?.col === column?.id
				if (!priority) return null
				if (isEditing) {
					return (
						<PriorityEditField
							onSave={(value) => {
								updateCell(row?.id, column?.id, value)
								setEditingCell(null)
							}}
							initialValue={priority}
						/>
					)
				}
				return (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<p className="capitalize flex items-center gap-2">
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
					</div>
				)
			},
		},
		{
			accessorKey: 'status_id',
			header: 'Status',
			cell: ({ getValue, row, column }) => {
				const statusId = getValue() as string
				if (!statusId) return null
				const statusInfo = statusList?.find((opt) => opt.id === statusId)
				return statusInfo ? (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<Badge
							className="text-black font-medium rounded-full"
							style={{
								color: statusInfo?.color,
								backgroundColor: `${statusInfo?.color}1a`,
							}}
						>
							{statusInfo?.name}
						</Badge>
					</div>
				) : null
			},
		},
		// {
		// 	accessorKey: 'tag_ids',
		// 	header: 'Tags',
		// 	cell: ({ getValue, row, column }) => {
		// 		const tagIds = getValue() as string[]
		// 		if (!tagIds?.length) return null
		// 		const tags = tagsList?.filter((opt) => tagIds?.includes(opt.id))
		// 		return tags ? (
		// 			<div
		// 				className="h-full w-full px-3 flex items-center"
		// 				onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
		// 			>
		// 				<div className="flex gap-1">
		// 					{tags?.slice(0, 3)?.map((tag) => (
		// 						<Badge className="rounded-full" key={tag.id}>
		// 							{tag.name}
		// 						</Badge>
		// 					))}
		// 				</div>
		// 			</div>
		// 		) : null
		// 	},
		// },
		{
			accessorKey: 'due_date',
			header: 'Date',
			cell: ({ getValue, row, column }) => {
				const date = getValue() as string
				if (!date) return null
				return (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<p className="whitespace-nowrap">{formatDate(date)}</p>
					</div>
				)
			},
		},
		{
			accessorKey: 'updated_at',
			header: 'Last updated',
			cell: ({ getValue, row, column }) => {
				const updated = getValue() as string
				if (!updated) return null
				return (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<p className="whitespace-nowrap">
							{formatDate(updated, 'MMM DD, YYYY HH:mm a')}
						</p>
					</div>
				)
			},
		},
	]

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

		if (tagsFilter?.length) {
			temp = temp?.filter((task) => tagsFilter?.find((tag) => task.tag_ids?.includes(tag)))
		}

		return temp
	}, [searchQuery, tasks, statusFilter, priorityFilter, tagsFilter])

	if (!tasks) return null

	return (
		<DataTable
			columns={columns}
			data={filteredTasks}
			onRowClick={(row) => onViewTask?.(row.original)}
		/>
	)
}
