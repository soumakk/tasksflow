import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectRoot,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/widgets/DatePicker'
import { MultiSelect } from '@/components/widgets/MultiSelect'
import { PriorityOptions } from '@/lib/data'
import { db } from '@/lib/db'
import { useStatus, useTags } from '@/lib/hooks/dexie'
import { generateId } from '@/lib/utils'
import { ITask } from '@/types/tasks'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { Button } from '../components/ui/button'
import Select from '../components/widgets/Select'

export default function SaveTaskDrawer({
	onClose,
	selectedTask,
}: {
	onClose: () => void
	selectedTask?: ITask
}) {
	const { statusList, isStatusLoading } = useStatus()
	const { tagsList, isTagsLoading } = useTags()

	const form = useForm({
		defaultValues: {
			title: selectedTask?.title ?? '',
			description: selectedTask?.description ?? '',
			priority: selectedTask?.priority ?? '',
			status: selectedTask?.status_id ?? '',
			due_date: selectedTask?.due_date ?? '',
			tags: selectedTask?.tag_ids ?? [],
		},
		onSubmit: async ({ value }) => {
			if (selectedTask) {
				const updatedTask = {
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
				await db.tasks.update(selectedTask.id, updatedTask)
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

	const statusOptions = statusList?.map((status) => ({
		label: status.name,
		value: status.id.toString(),
		color: status.color,
	}))

	const tagsOptions =
		tagsList?.map((tag) => ({
			label: tag.name,
			value: tag.id,
		})) ?? []

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

							<SelectRoot
								value={field.state.value}
								onValueChange={(value) => field.handleChange(value)}
							>
								<SelectTrigger id={field.name} className="w-full">
									<SelectValue placeholder={'Select a option'} />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{statusOptions?.map((opt) => (
											<SelectItem
												key={opt.value}
												value={opt.value}
												icon={
													<div className="h-3 w-3 grid place-content-center">
														<div
															className="h-2 w-2 rounded-full"
															style={{
																backgroundColor: opt.color,
															}}
														></div>
													</div>
												}
											>
												{opt.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</SelectRoot>
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
