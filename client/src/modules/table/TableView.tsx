import DataTable from '@/components/widgets/DataTable'
import { db } from '@/lib/db'
import useFilteredTasks from '@/lib/hooks/useFilteredTasks'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { Calendar1, Disc, Flag, Hourglass, Tag, Trash2, Type } from 'lucide-react'
import { useState } from 'react'
import { formatDate } from '../../lib/utils'
import { IStatus, ITag, ITask, TaskPriority } from '../../types/tasks'
import SubTaskProgress from '../task/SubTaskProgress'
import PriorityEditField from './fields/PriorityEditField'
import StatusEditField from './fields/StatusEditField'
import TagEditField from './fields/TagEditField'

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
	const filteredTasks = useFilteredTasks({ tasks: tasksList })
	const [editingCell, setEditingCell] = useState(null)

	async function deleteRow(id: string) {
		await db.tasks.delete(id)
	}

	async function updateCell(id: string, key: string, value: any) {
		const task = tasksList.find((t) => t.id === id)
		await db.tasks.update(id, { ...task, [key]: value, updated_at: dayjs().toISOString() })
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
					<div className="h-full w-full px-3 flex items-center cursor-pointer gap-3">
						<p className="whitespace-nowrap">{value}</p>

						<SubTaskProgress subTasks={row.original.sub_tasks} size={16} stroke={2} />
					</div>
				)
			},
			size: 300,
		},
		{
			accessorKey: 'description',
			header: () => (
				<p className="flex gap-2 items-center">
					<Type className="h-4 w-4" />
					<span>Description</span>
				</p>
			),
			cell: ({ getValue }) => {
				const value = getValue() as string
				return (
					<div className="h-full w-full px-3 flex items-center cursor-pointer gap-3">
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
				return (
					<PriorityEditField
						onSave={(value) => {
							updateCell(row?.id, column?.id, value)
							setEditingCell(null)
						}}
						initialValue={priority}
					/>
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
				return (
					<StatusEditField
						onSave={(value) => {
							updateCell(row?.id, column?.id, value)
							setEditingCell(null)
						}}
						initialValue={statusId}
						statusList={statusList}
					/>
				)
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
			accessorKey: 'tag_ids',
			header: () => (
				<p className="flex gap-2 items-center">
					<Tag className="h-4 w-4" />
					<span>Tags</span>
				</p>
			),
			cell: ({ getValue, row, column }) => {
				const tagIds = getValue() as string[]
				return (
					<TagEditField
						onSave={(value) => {
							updateCell(row?.id, column?.id, value)
							setEditingCell(null)
						}}
						initialValue={tagIds}
						tagsList={tagsList}
					/>
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

	return (
		<DataTable
			columns={columns}
			data={filteredTasks}
			onRowClick={(row) => onViewTask(row.id)}
		/>
	)
}
