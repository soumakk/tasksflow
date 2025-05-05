import { Badge } from '@/components/ui/badge'
import DataTable from '@/components/widgets/DataTable'
import { priorityFilterAtom, searchQueryAtom, statusFilterAtom, tagsFilterAtom } from '@/lib/atoms'
import { db } from '@/lib/db'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useAtomValue } from 'jotai'
import {
	ALargeSmall,
	Calendar1,
	Disc,
	Flag,
	Hourglass,
	Tag,
	Tags,
	Trash2,
	Type,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatDate } from '../../lib/utils'
import { IStatus, ITag, ITask, TaskPriority } from '../../types/tasks'
import DateField from '../fields/DateField'
import PriorityField from '../fields/PriorityField'
import StatusField from '../fields/StatusField'
import TextField from '../fields/TextField'
import PriorityFlag from '@/components/widgets/Flag'
import { PriorityOptions } from '@/lib/data'
import StatusBadge from '@/components/widgets/StatusBadge'
import TagBadge from '@/components/widgets/TagBadge'

export default function TableView({
	statusList,
	tagsList,
	tasksList,
	onViewTask,
}: {
	tasksList: ITask[]
	statusList: IStatus[]
	tagsList: ITag[]
	onViewTask: (taskId: string) => void
}) {
	const searchQuery = useAtomValue(searchQueryAtom)
	const statusFilter = useAtomValue(statusFilterAtom)
	const tagsFilter = useAtomValue(tagsFilterAtom)
	const priorityFilter = useAtomValue(priorityFilterAtom)
	const [editingCell, setEditingCell] = useState(null)

	async function updateCell(id: string, key: string, value: string) {
		const task = tasksList.find((t) => t.id === id)
		await db.tasks.update(id, { ...task, [key]: value, updated_at: dayjs().toISOString() })
	}

	async function deleteRow(id: string) {
		await db.tasks.delete(id)
	}

	const columns: ColumnDef<ITask>[] = [
		{
			id: 'action',
			header: () => null,
			cell: ({ row }) => {
				return (
					<div className="h-full w-full items-center justify-center hidden group-hover/row:flex">
						<Trash2
							className="h-3.5 w-3.5 text-red-500 cursor-pointer"
							onClick={(e) => {
								e.stopPropagation()
								deleteRow(row?.id)
							}}
						/>
					</div>
				)
			},
			size: 40,
		},
		{
			accessorKey: 'title',
			header: () => (
				<p className="flex gap-2 items-center">
					<Type className="h-4 w-4" />
					<span>Title</span>
				</p>
			),
			cell: ({ getValue, row, column }) => {
				const isEditing = editingCell?.row === row?.id && editingCell?.col === column?.id
				const value = getValue() as string

				return (
					<div className="h-full w-full px-3 flex items-center cursor-pointer">
						<p className="whitespace-nowrap">{value}</p>
					</div>
				)
			},
			size: 300,
		},
		{
			accessorKey: 'priority',
			header: () => (
				<p className="flex gap-2 items-center">
					<Flag className="h-4 w-4" />
					<span>Priority</span>
				</p>
			),
			cell: ({ getValue, row, column }) => {
				const priority = getValue() as TaskPriority
				const selectedLabel = PriorityOptions?.find((opt) => opt.value === priority)?.label

				if (!priority) {
					return null
				}
				return (
					<button className="w-full h-full flex items-center gap-2 px-3 cursor-pointer data-[state=open]:outline-2 outline-primary">
						<PriorityFlag priority={priority} />
						<span>{selectedLabel}</span>
					</button>
				)
			},
		},
		{
			accessorKey: 'status_id',
			header: () => (
				<p className="flex gap-2 items-center">
					<Disc className="h-4 w-4" />
					<span>Status</span>
				</p>
			),
			cell: ({ getValue, row, column }) => {
				const statusId = getValue() as string
				const statusInfo = statusList?.find((opt) => opt.id === statusId)

				return <StatusBadge status={statusInfo} />
			},
		},
		{
			accessorKey: 'tag_ids',
			header: () => (
				<p className="flex gap-2 items-center">
					<Tag className="h-4 w-4" />
					<span>Tags</span>
				</p>
			),
			cell: ({ getValue, row, column }) => {
				const tagIds = getValue() as string[]
				if (!tagIds?.length) return null
				const tags = tagsList?.filter((opt) => tagIds?.includes(opt.id))
				return tags ? (
					<div
						className="h-full w-full px-3 flex items-center"
						onDoubleClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<div className="flex gap-1">
							{tags?.slice(0, 3)?.map((tag) => (
								<TagBadge tag={tag} />
							))}
						</div>
					</div>
				) : null
			},
		},
		{
			accessorKey: 'due_date',
			header: () => (
				<p className="flex gap-2 items-center whitespace-nowrap">
					<Calendar1 className="h-4 w-4" />
					<span>Due Date</span>
				</p>
			),
			cell: ({ getValue, row, column }) => {
				const date = getValue() as string

				return (
					<button className="h-full w-full px-3 flex items-center cursor-pointer data-[state=open]:outline-2 outline-primary">
						{date ? <p className="whitespace-nowrap">{formatDate(date)}</p> : null}
					</button>
				)
			},
		},
		{
			accessorKey: 'updated_at',
			header: () => (
				<p className="flex gap-2 items-center whitespace-nowrap">
					<Hourglass className="h-4 w-4" />
					<span>Last updated</span>
				</p>
			),
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
		let temp = tasksList?.slice()

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
	}, [searchQuery, tasksList, statusFilter, priorityFilter, tagsFilter])

	return (
		<DataTable
			columns={columns}
			data={filteredTasks}
			onRowClick={(row) => onViewTask(row.id)}
		/>
	)
}
