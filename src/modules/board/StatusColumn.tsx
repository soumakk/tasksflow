import { cn } from '@/lib/utils'
import { IStatus, ITask } from '@/types/tasks'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { useRef, useState, useEffect } from 'react'
import invariant from 'tiny-invariant'
import TaskCard from './TaskCard'
import { Badge } from '@/components/ui/badge'

export default function StatusColumn({ status, tasks }: { status: IStatus; tasks: ITask[] }) {
	const colRef = useRef(null)
	const [isDraggedOver, setIsDraggedOver] = useState(false)

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

	return (
		<div
			ref={colRef}
			className={cn('bg-card p-2 w-60 rounded-lg border border-border/20', {
				'bg-blue-50': isDraggedOver,
			})}
		>
			<Badge
				className="text-black font-medium rounded-full mb-2"
				style={{
					color: status?.color,
					backgroundColor: `${status?.color}1a`,
				}}
			>
				{status?.name}
			</Badge>

			{tasks?.map((task) => (
				<TaskCard task={task} key={task.id} />
			))}
		</div>
	)
}
