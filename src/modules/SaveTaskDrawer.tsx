import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/widgets/DatePicker'
import { statusAtom, tagsAtom, tasksAtom } from '@/lib/atoms'
import { PriorityOptions } from '@/lib/data'
import { generateId } from '@/lib/utils'
import { ITask } from '@/types/tasks'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { useAtomValue, useSetAtom } from 'jotai'
import { Button } from '../components/ui/button'
import { MultiSelect } from '../components/widgets/MultiSelect'
import Select from '../components/widgets/Select'
import { useEffect } from 'react'

interface ITaskForm {
	title: string
	description: string
	priority: string
	status: string
	due_date: string
	tags: string[]
}

export default function SaveTaskDrawer({
	open,
	onClose,
	selectedTask,
}: {
	open: boolean
	onClose: () => void
	selectedTask?: ITask
}) {
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)
	const setTasks = useSetAtom(tasksAtom)

	const form = useForm({
		defaultValues: {
			title: '',
			description: '',
			priority: '',
			status: '',
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
					tag_ids: value?.tags,
				}
				setTasks((tasks) =>
					tasks?.map((task) => {
						if (task.id === selectedTask.id) return updatedTask
						else return task
					})
				)
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
					tag_ids: value?.tags,
				}
				setTasks((tasks) => [...tasks, newTask])
			}
			onClose()
		},
	})

	useEffect(() => {
		if (selectedTask) {
			form.reset({
				title: selectedTask?.title ?? '',
				description: selectedTask?.description ?? '',
				priority: selectedTask?.priority ?? '',
				status: selectedTask?.status_id ?? '',
				due_date: selectedTask?.due_date ?? '',
				tags: selectedTask?.tag_ids ?? [],
			})
		}
	}, [form, selectedTask])

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id.toString(),
	}))

	const tagsOptions = tagsList?.map((tag) => ({
		label: tag.name,
		value: tag.id,
	}))

	return (
		<Drawer
			open={open}
			onOpenChange={() => {
				onClose()
				form.reset()
			}}
			direction="right"
		>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>{selectedTask ? 'Edit' : 'New'} Task</DrawerTitle>
				</DrawerHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						void form.handleSubmit()
					}}
					className="flex-1 flex flex-col overflow-hidden"
				>
					<div className="space-y-4 px-6 flex-1 overflow-auto">
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
						<form.Field name="priority">
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
						<form.Field name="status">
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
						<form.Field name="tags">
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
						</form.Field>
						<form.Field name="due_date">
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

					<DrawerFooter>
						<DrawerClose asChild>
							<Button
								// disabled={addTaskMutation.isPending}
								variant="outline"
								className="w-full"
							>
								Cancel
							</Button>
						</DrawerClose>
						<Button
						//  disabled={addTaskMutation.isPending}
						>
							Save
						</Button>
					</DrawerFooter>
				</form>
			</DrawerContent>
		</Drawer>
	)
}
