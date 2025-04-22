import { db } from '@/lib/db'
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

import { boardColumnsAtom } from '@/lib/atoms'
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index'
import {
	BaseEventPayload,
	ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types'
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtom } from 'jotai'
import { isEmpty } from 'radash'
import { useCallback, useEffect } from 'react'
import StatusColumn from './StatusColumn'

export default function BoardView() {
	const tasksList = useLiveQuery(() => db.tasks.toArray())
	const statusList = useLiveQuery(() => db.status.toArray())

	const [columnData, setColumnData] = useAtom(boardColumnsAtom)

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
