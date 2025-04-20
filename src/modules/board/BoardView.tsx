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
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index'
import {
	BaseEventPayload,
	ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import { useLiveQuery } from 'dexie-react-hooks'
import { isEmpty } from 'radash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { boardColumnsAtom } from '@/lib/atoms'

export default function BoardView() {
	const tasksList = useLiveQuery(() => db.tasks.toArray())
	const statusList = useLiveQuery(() => db.status.toArray())

	const [columnData, setColumnData] = useAtom(boardColumnsAtom)

	useEffect(() => {
		if (tasksList?.length && statusList?.length && isEmpty(columnData)) {
			const temp = {} as Record<string, string[]>
			for (const status of statusList) {
				temp[status.id] = tasksList
					?.filter((t) => t.status_id === status.id)
					?.map((t) => t.id)
			}
			setColumnData(temp)
		}
	}, [columnData, setColumnData, statusList, tasksList])

	const reorderCard = useCallback(
		({
			columnId,
			startIndex,
			finishIndex,
		}: {
			columnId: string
			startIndex: number
			finishIndex: number
		}) => {
			const sourceTasks = columnData?.[columnId]

			const updatedItems = reorder({
				list: sourceTasks,
				startIndex,
				finishIndex,
			})
			setColumnData((prev) => {
				return {
					...prev,
					[columnId]: updatedItems,
				}
			})
		},
		[columnData, setColumnData]
	)

	const moveCard = useCallback(
		async ({
			sourceColId,
			targetColId,
			sourceTaskIdx,
			targetTaskIdx,
		}: {
			sourceColId: string
			targetColId: string
			sourceTaskIdx: number
			targetTaskIdx: number
		}) => {
			const sourceTasks = columnData[sourceColId]
			const targetTasks = columnData[targetColId]
			const sourceTaskId = sourceTasks[sourceTaskIdx]

			const [taskToMove] = sourceTasks.splice(sourceTaskIdx, 1)
			targetTasks?.splice(targetTaskIdx, 0, taskToMove)

			setColumnData((prev) => ({
				...prev,
				[sourceColId]: sourceTasks,
				[targetColId]: targetTasks,
			}))

			await db.tasks.update(sourceTaskId, { status_id: targetColId })
		},
		[columnData, setColumnData]
	)

	const handleDrop = useCallback(
		({ source, location }: BaseEventPayload<ElementDragType>) => {
			const destination = location.current.dropTargets.length
			if (!destination) {
				return
			}

			if (source.data.type === 'task') {
				const sourceTaskId = source.data.taskId
				const [, sourceCol] = location.initial.dropTargets
				const sourceColId = sourceCol.data.colId as string
				const sourceTasks = columnData?.[sourceColId]
				const sourceTaskIdx = sourceTasks?.findIndex((t) => t == sourceTaskId)

				if (location.current.dropTargets.length === 1) {
					// drop on a column
					const targetColId = location.current.dropTargets[0].data.colId as string

					if (sourceColId === targetColId) {
						const destinationIndex = getReorderDestinationIndex({
							startIndex: sourceTaskIdx,
							indexOfTarget: sourceTasks.length - 1,
							closestEdgeOfTarget: null,
							axis: 'vertical',
						})

						reorderCard({
							columnId: sourceColId,
							startIndex: sourceTaskIdx,
							finishIndex: destinationIndex,
						})
					} else {
						const targetTasks = columnData[targetColId]

						moveCard({
							sourceColId: sourceColId,
							targetColId: targetColId,
							sourceTaskIdx: sourceTaskIdx,
							targetTaskIdx: targetTasks?.length,
						})
					}
				}

				if (location.current.dropTargets.length === 2) {
					// drop on a task
					const [targetCardRecord, targetColumnRecord] = location.current.dropTargets
					const targetColId = targetColumnRecord?.data?.colId as string
					const targetTasks = columnData[targetColId]

					const targetToMove = targetTasks?.findIndex(
						(taskId) => taskId === targetCardRecord.data?.taskId
					)

					const closestEdgeOfTarget = extractClosestEdge(targetCardRecord.data)

					if (sourceColId === targetColId) {
						const destinationIndex = getReorderDestinationIndex({
							startIndex: sourceTaskIdx,
							indexOfTarget: targetToMove,
							closestEdgeOfTarget,
							axis: 'vertical',
						})

						reorderCard({
							columnId: sourceColId,
							startIndex: sourceTaskIdx,
							finishIndex: destinationIndex,
						})
					} else {
						moveCard({
							sourceColId: sourceColId,
							targetColId: targetColId,
							sourceTaskIdx: sourceTaskIdx,
							targetTaskIdx:
								closestEdgeOfTarget === 'bottom' ? targetToMove + 1 : targetToMove,
						})
					}
				}
			}
		},
		[columnData, moveCard, reorderCard]
	)

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
			{Object.entries(columnData)?.map(([statusId, taskIds]) => {
				const status = statusList.find((st) => st.id === statusId)
				return (
					<StatusColumn
						status={status}
						key={status.id}
						tasks={taskIds?.map((taskId) => tasksList?.find((t) => t.id === taskId))}
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
