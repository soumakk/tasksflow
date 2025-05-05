import { Dialog, DialogContent } from '@/components/ui/dialog'
import { db } from '@/lib/db'
import { useStatus, useTags } from '@/lib/hooks/dexie'
import { ITask } from '@/types/tasks'
import dayjs from 'dayjs'
import DateField from '../fields/DateField'
import PriorityField from '../fields/PriorityField'
import StatusField from '../fields/StatusField'
import TagsField from '../fields/TagsField'
import TextField from '../fields/TextField'
import TextareaField from '../fields/TextareaField'
import SubTasksList from './SubTasksList'

export default function TaskDetailsDialog({
	open,
	onClose,
	task,
}: {
	open: boolean
	onClose: () => void
	task: ITask
}) {
	const { statusList, isStatusLoading } = useStatus()
	const { tagsList } = useTags()

	async function updateCell(id: string, key: string, value: any) {
		await db.tasks.update(id, { ...task, [key]: value, updated_at: dayjs().toISOString() })
	}

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="overflow-hidden max-w-3xl sm:rounded-3xl p-6">
				<button></button>

				<div className="grid grid-cols-5 gap-8">
					<div className="col-span-3">
						<div className="mb-3">
							<TextField
								className="text-xl font-medium w-full focus:outline-2 outline-primary p-2 "
								placeholder="Untitled"
								defaultValue={task.title}
								onSave={(value) => {
									updateCell(task?.id, 'title', value)
								}}
							/>
						</div>
						<div>
							<TextareaField
								initialValue={task.description}
								onSave={(value) => {
									updateCell(task?.id, 'description', value)
								}}
							/>
						</div>

						<SubTasksList task={task} />
					</div>

					<div className="col-span-2 flex flex-col">
						<div className="pb-6 flex flex-col gap-2 items-start">
							<label className="text-muted-foreground text-xs uppercase font-medium">
								Due date
							</label>

							<DateField
								initialValue={task?.due_date}
								onSave={(value) => {
									updateCell(task?.id, 'due_date', value)
								}}
							/>
						</div>

						<div className="pb-6 flex flex-col gap-2 items-start">
							<label className="text-muted-foreground text-xs uppercase font-medium">
								Status
							</label>
							<StatusField
								onSave={(value) => {
									updateCell(task?.id, 'status_id', value)
								}}
								initialValue={task?.status_id}
								statusList={statusList}
							/>
						</div>

						<div className="pb-6 flex flex-col gap-2 items-start">
							<label className="text-muted-foreground text-xs uppercase font-medium">
								Priority
							</label>
							<PriorityField
								onSave={(value) => {
									updateCell(task?.id, 'priority', value)
								}}
								initialValue={task.priority}
							/>
						</div>

						<div className="pb-6 flex flex-col gap-2 items-start">
							<label className="text-muted-foreground text-xs uppercase font-medium">
								Tags
							</label>
							<TagsField
								onSave={(value) => {
									updateCell(task?.id, 'tag_ids', value)
								}}
								initialTags={task?.tag_ids}
								tagsList={tagsList}
							/>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
