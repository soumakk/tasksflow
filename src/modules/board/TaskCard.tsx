import PriorityFlag from '@/components/widgets/Flag'
import TagBadge from '@/components/widgets/TagBadge'
import { useTags } from '@/lib/hooks/dexie'
import { cn, formatDate } from '@/lib/utils'
import { ITask, TaskPriority } from '@/types/tasks'
import {
	attachClosestEdge,
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Calendar, Calendar1 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'

export default function TaskCard({
	task,
	onViewTask,
}: {
	task: ITask
	onViewTask: (taskId: string) => void
}) {
	const { tagsList } = useTags()
	const taskRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)
	const [closestEdge, setClosestEdge] = useState(null)

	useEffect(() => {
		const taskEl = taskRef.current
		invariant(taskEl)

		return combine(
			draggable({
				element: taskEl,
				getInitialData: () => ({ type: 'task', taskId: task.id }),
				onDragStart: () => setIsDragging(true),
				onDrop: () => setIsDragging(false),
			}),
			dropTargetForElements({
				element: taskEl,
				getData: ({ input, element }) => {
					const data = { type: 'task', taskId: task.id }
					return attachClosestEdge(data, {
						input,
						element,
						allowedEdges: ['top', 'bottom'],
					})
				},
				getIsSticky: () => true,
				onDragEnter: (args) => {
					// Update the closest edge when a draggable item enters the drop zone
					if (args.source.data.taskId !== task.id) {
						setClosestEdge(extractClosestEdge(args.self.data))
					}
				},
				onDrag: (args) => {
					// Continuously update the closest edge while dragging over the drop zone
					if (args.source.data.taskId !== task.id) {
						setClosestEdge(extractClosestEdge(args.self.data))
					}
				},
				onDragLeave: () => {
					// Reset the closest edge when the draggable item leaves the drop zone
					setClosestEdge(null)
				},
				onDrop: () => {
					// Reset the closest edge when the draggable item is dropped
					setClosestEdge(null)
				},
			})
		)
	}, [task.id])

	const selectedTags = tagsList?.filter((tag) => task.tag_ids?.includes(tag.id))

	return (
		<div className="relative py-1">
			<div
				ref={taskRef}
				className={cn('bg-muted border border-border rounded-md p-3 text-xs shadow-xs', {
					'opacity-50': isDragging,
				})}
				onClick={() => onViewTask(task.id)}
			>
				<p className="text-sm">{task.title}</p>

				<div className="flex items-center gap-2 my-2">
					<PriorityFlag priority={task.priority as TaskPriority} className="h-4 w-4" />
					<span className="capitalize">{task.priority}</span>
				</div>

				{task.due_date ? (
					<div className="flex items-center gap-2">
						<Calendar1 className="h-4 w-4 text-muted-foreground" />
						<span>{formatDate(task.due_date)}</span>
					</div>
				) : null}

				<div className="flex gap-1 mt-2">
					{selectedTags?.map((tag) => (
						<TagBadge tag={tag} />
					))}
				</div>
			</div>

			{closestEdge && <DropIndicator edge={closestEdge} />}
		</div>
	)
}

function DropIndicator({ edge }: { edge: Edge }) {
	return (
		<div
			className={cn(' absolute  bg-blue-500 h-0.5 w-full rounded-2xl', {
				'-top-[1px]': edge === 'top',
				'-bottom-[1px]': edge === 'bottom',
			})}
		></div>
	)
}
