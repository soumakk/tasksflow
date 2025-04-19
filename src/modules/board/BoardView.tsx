import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/db'
import { cn } from '@/lib/utils'
import {
	attachClosestEdge,
	Edge,
	extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine'
import {
	draggable,
	dropTargetForElements,
	monitorForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import invariant from 'tiny-invariant'

import { IStatus, ITask } from '@/types/tasks'
import { useLiveQuery } from 'dexie-react-hooks'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function BoardView() {
	const tasksList = useLiveQuery(() => db.tasks.toArray())
	const statusList = useLiveQuery(() => db.status.toArray())

	const [order, setOrder] = useState([])

	useEffect(() => {
		if (tasksList?.length && statusList?.length && order?.length === 0) {
			const temp = statusList?.map((s) => ({
				id: s.id,
				tasks: tasksList?.filter((t) => t.status_id === s.id)?.map((t) => t.id),
			}))
			setOrder(temp)
		}
	}, [order.length, statusList, tasksList])

	const handleDrop = useCallback(({ source, location }) => {
		// Logic to handle the drop event will be added here
		const destination = location.current.dropTargets.length
		if (!destination) {
			return
		}

		// if (source.data.type === 'task') {
		// }

		console.log('handleDrop', source, location)
	}, [])

	// setup the monitor
	useEffect(() => {
		return monitorForElements({
			onDrop: handleDrop,
		})
	}, [handleDrop])

	if (!tasksList || !statusList) {
		return null
	}

	return (
		<div className="flex gap-3 border-t border-border py-3">
			{order?.map((s) => {
				const status = statusList.find((st) => st.id === s.id)
				return (
					<StatusColumn
						status={status}
						key={status.id}
						tasks={tasksList?.filter((t) => s.tasks?.includes(t.id))}
					/>
				)
			})}
		</div>
	)
}

function StatusColumn({ status, tasks }: { status: IStatus; tasks: ITask[] }) {
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
				<Task task={task} key={task.id} />
			))}
		</div>
	)
}

function Task({ task }: { task: ITask }) {
	const taskRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)
	const [closestEdge, setClosestEdge] = useState(null) // NEW

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

	return (
		<div className="relative py-1">
			<div
				ref={taskRef}
				className={cn('bg-background rounded p-2 text-xs shadow-xs', {
					'opacity-50': isDragging,
				})}
			>
				{task.title} - {task.status_id}
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
