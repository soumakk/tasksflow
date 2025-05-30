import StatusBadge from '@/components/widgets/StatusBadge'
import { cn } from '@/lib/utils'
import { IStatus, ITask } from '@/types/tasks'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import TaskCard from './TaskCard'
import useFilteredTasks from '@/lib/hooks/useFilteredTasks'

export default function StatusColumn({
	status,
	tasks,
	onViewTask,
}: {
	status: IStatus
	tasks: ITask[]
	onViewTask: (taskId: string) => void
}) {
	const colRef = useRef(null)
	const [isDraggedOver, setIsDraggedOver] = useState(false)
	const filteredTasks = useFilteredTasks({ tasks, skipSort: true })

	useEffect(() => {
		const colEl = colRef.current
		invariant(colEl)

		return dropTargetForElements({
			element: colEl,
			onDragStart: () => setIsDraggedOver(true),
			onDragEnter: () => setIsDraggedOver(true),
			onDragLeave: () => setIsDraggedOver(false),
			onDrop: () => setIsDraggedOver(false),
			getData: () => ({ colId: status.id }),
			getIsSticky: () => true,
		})
	}, [status.id])

	if (!filteredTasks?.length) {
		return null
	}

	return (
		<div
			ref={colRef}
			className={cn('max-w-64 min-w-64 p-2 rounded-lg h-full flex flex-col overflow-hidden', {
				'ring-2 ring-primary': isDraggedOver,
			})}
		>
			<div className="pb-2">
				<StatusBadge status={status} />
			</div>

			<div className="overflow-y-auto flex-1">
				{filteredTasks?.map((task) => (
					<TaskCard task={task} key={task.id} onViewTask={onViewTask} />
				))}
			</div>
		</div>
	)
}
