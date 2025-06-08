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
import { Calendar1, Disc, Flag, Tag } from 'lucide-react'

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
			<DialogContent className="overflow-hidden max-w-xl sm:rounded-3xl p-6">
				<button className="absolute"></button>

				<div className="">
					<div className="mb-3">
						<TextField
							className="text-xl font-medium w-full focus:outline-2 outline-primary p-2 rounded-sm"
							placeholder="Untitled"
							defaultValue={task.title}
							onSave={(value) => {
								updateCell(task?.id, 'title', value)
							}}
						/>
					</div>

					<div className="grid grid-cols-3 gap-2 items-center">
						<label className="text-muted-foreground text-xs font-medium flex items-center gap-2">
							<Calendar1 className="h-4 w-4 text-muted-foreground" />
							Due date
						</label>
						<div className="col-span-2">
							<DateField
								initialValue={task?.due_date}
								onSave={(value) => {
									updateCell(task?.id, 'due_date', value)
								}}
							/>
						</div>

						<label className="text-muted-foreground text-xs flex items-center gap-2 font-medium">
							<Disc className="h-4 w-4" />
							Status
						</label>
						<div className="col-span-2">
							<StatusField
								onSave={(value) => {
									updateCell(task?.id, 'status_id', value)
								}}
								initialValue={task?.status_id}
								statusList={statusList}
							/>
						</div>

						<label className="text-muted-foreground text-xs flex items-center gap-2 font-medium">
							<Flag className="h-4 w-4" />
							Priority
						</label>
						<div className="col-span-2">
							<PriorityField
								onSave={(value) => {
									updateCell(task?.id, 'priority', value)
								}}
								initialValue={task.priority}
							/>
						</div>

						<label className="text-muted-foreground text-xs flex items-center gap-2 font-medium">
							<Tag className="h-4 w-4" />
							Tags
						</label>
						<div className="col-span-2">
							<TagsField
								onSave={(value) => {
									updateCell(task?.id, 'tag_ids', value)
								}}
								initialTags={task?.tag_ids}
								tagsList={tagsList}
							/>
						</div>
					</div>

					<div className="my-3 flex flex-col gap-3">
						<label className="text-muted-foreground text-xs font-medium">
							Description
						</label>
						<TextareaField
							initialValue={task.description}
							onSave={(value) => {
								updateCell(task?.id, 'description', value)
							}}
						/>
					</div>

					<SubTasksList task={task} />
				</div>
			</DialogContent>
		</Dialog>
	)
}
