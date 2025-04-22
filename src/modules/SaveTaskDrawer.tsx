import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/widgets/DatePicker'
import { PriorityOptions } from '@/lib/data'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils'
import { ITask, TaskPriority } from '@/types/tasks'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { useLiveQuery } from 'dexie-react-hooks'
import { Button } from '../components/ui/button'
import Select from '../components/widgets/Select'

interface ITaskForm {
	title: string
	description: string
	priority: string
	status: string
	due_date: string
	tags: string[]
}

export default function SaveTaskDrawer({
	onClose,
	selectedTask,
}: {
	onClose: () => void
	selectedTask?: ITask
}) {
	const statusList = useLiveQuery(() => db.status.toArray())
	// const tagsList = useAtomValue(tagsAtom)
	// const setTasks = useSetAtom(tasksAtom)

	const form = useForm({
		defaultValues: {
			title: '',
			description: '',
			priority: '',
			status: 's-1',
			due_date: '',
			tags: [],
		},
		onSubmit: async ({ value }) => {
			if (selectedTask) {
				const updatedTask: ITask = {
					due_date: value.due_date,
					priority: value.priority,
					title: value.title,
					description: value?.description ?? null,
					status_id: value?.status,
					created_at: selectedTask?.created_at,
					updated_at: dayjs().toISOString(),
					id: selectedTask.id,
					tag_ids: value?.tags ?? [],
				}
				// setTasks((tasks) =>
				// 	tasks?.map((task) => {
				// 		if (task.id === selectedTask.id) return updatedTask
				// 		else return task
				// 	})
				// )
			} else {
				const newTask: ITask = {
					due_date: value.due_date,
					priority: value.priority,
					title: value.title,
					description: value?.description ?? null,
					status_id: value?.status,
					created_at: dayjs().toISOString(),
					updated_at: dayjs().toISOString(),
					id: generateId(),
					tag_ids: value?.tags ?? [],
				}
				await db.tasks.add(newTask)
			}
			onClose()
		},
	})

	// useEffect(() => {
	// 	if (selectedTask) {
	// 		form.reset({
	// 			title: selectedTask?.title ?? '',
	// 			description: selectedTask?.description ?? '',
	// 			priority: selectedTask?.priority ?? '',
	// 			status: selectedTask?.status_id ?? '',
	// 			due_date: selectedTask?.due_date ?? '',
	// 			tags: selectedTask?.tag_ids ?? [],
	// 		})
	// 	}
	// }, [form, selectedTask])

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id.toString(),
	}))

	// const tagsOptions = tagsList?.map((tag) => ({
	// 	label: tag.name,
	// 	value: tag.id,
	// }))

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()
				void form.handleSubmit()
			}}
			className="flex-1 flex flex-col overflow-hidden"
		>
			<div className="space-y-4  p-4 flex-1 overflow-auto">
				<form.Field name="title">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Title</Label>
							<Input
								autoFocus
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				</form.Field>
				<form.Field name="description">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Description</Label>
							<Input
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</div>
					)}
				</form.Field>
				<form.Field name="priority" defaultValue={TaskPriority.Normal}>
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Priority</Label>
							<Select
								id={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
								options={PriorityOptions}
							/>
						</div>
					)}
				</form.Field>
				<form.Field name="status" defaultValue="s-1">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Status</Label>
							<Select
								id={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
								options={statusOptions}
							/>
						</div>
					)}
				</form.Field>
				{/* <form.Field name="tags">
							{(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name}>Tags</Label>
									<MultiSelect
										title="tags"
										id={field.name}
										value={field.state.value}
										onChange={(selected) => field.handleChange(selected)}
										options={tagsOptions}
									/>
								</div>
							)}
						</form.Field> */}
				<form.Field name="due_date" defaultValue={dayjs().toISOString()}>
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Due Date</Label>
							<DatePicker
								id={field.name}
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
							/>
						</div>
					)}
				</form.Field>
			</div>

			<div className="flex items-center gap-2 px-4 pb-4">
				<Button
					//  disabled={addTaskMutation.isPending}
					size="sm"
					className="w-full"
				>
					Save
				</Button>
			</div>
		</form>
	)
}
