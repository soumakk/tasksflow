import DataTable from '@/components/widgets/DataTable'
import { priorityFilterAtom, searchQueryAtom, statusFilterAtom, tagsFilterAtom } from '@/lib/atoms'
import { db } from '@/lib/db'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtomValue } from 'jotai'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatDate } from '../../lib/utils'
import { ITask, TaskPriority } from '../../types/tasks'
import DateEditField from '../fields/DateEditField'
import PriorityEditField from '../fields/PriorityEditField'
import StatusEditField from '../fields/StatusEditField'
import TextEditField from '../fields/TextEditField'

export default function TableView() {
	const searchQuery = useAtomValue(searchQueryAtom)
	const statusFilter = useAtomValue(statusFilterAtom)
	const tagsFilter = useAtomValue(tagsFilterAtom)
	const priorityFilter = useAtomValue(priorityFilterAtom)
	const [editingCell, setEditingCell] = useState(null)
	const tasks = useLiveQuery(() => db.tasks.toArray())
	const statusList = useLiveQuery(() => db.status.toArray())

	async function updateCell(id: string, key: string, value: string) {
		const task = tasks.find((t) => t.id === id)
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
							className="h-3.5 w-3.5 text-red-500"
							onClick={() => deleteRow(row?.id)}
						/>
					</div>
				)
			},
			size: 40,
		},
		{
			accessorKey: 'title',
			header: 'Title',
			cell: ({ getValue, row, column }) => {
				const isEditing = editingCell?.row === row?.id && editingCell?.col === column?.id
				const value = getValue() as string
				if (isEditing) {
					return (
						<TextEditField
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
						className="h-full w-full px-3 flex items-center cursor-pointer"
						onClick={() => setEditingCell({ row: row.id, col: column.id })}
					>
						<p className="whitespace-nowrap">{value}</p>
					</div>
				)
			},
			size: 300,
		},
		{
			accessorKey: 'description',
			header: 'Description',
			cell: ({ getValue, row, column }) => {
				const isEditing = editingCell?.row === row?.id && editingCell?.col === column?.id
				const value = getValue() as string
				if (isEditing) {
					return (
						<TextEditField
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
						className="h-full w-full px-3 flex items-center cursor-pointer"
						onClick={() => setEditingCell({ row: row.id, col: column.id })}
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
			header: 'Status',
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
				return (
					<DateEditField
						initialValue={date}
						onSave={(value) => {
							updateCell(row?.id, column?.id, value)
							setEditingCell(null)
						}}
					/>
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

	if (!tasks || !statusList) return null

	return (
		<DataTable
			columns={columns}
			data={filteredTasks}
			// onRowClick={(row) => onViewTask?.(row.original)}
		/>
	)
}
