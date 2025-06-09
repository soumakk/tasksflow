import { Button } from '@/components/ui/button'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { boardColumnsAtom, isFiltersOpenAtom } from '@/lib/atoms'
import { db } from '@/lib/db'
import { useStatus, useTags, useTasks } from '@/lib/hooks/dexie'
import { cn, generateId } from '@/lib/utils'
import { AppSidebar } from '@/modules/dashboard/Sidebar'
import TableView from '@/modules/table/TableView'
import TasksFilters from '@/modules/table/TasksFilters'
import TaskDetailsDialog from '@/modules/task/TaskDetailsDialog'
import { ITask, TaskPriority } from '@/types/tasks'
import dayjs from 'dayjs'
import { useAtom, useSetAtom } from 'jotai'
import { ListFilter, Loader, PlusIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

function Home() {
	const [isFiltersOpen, setIsFiltersOpen] = useAtom(isFiltersOpenAtom)
	const [selectedTaskId, setSelectedTaskId] = useState(null)
	const params = useParams()
	const spaceId = params.spaceId as string

	// const { data: tasks } = useTasks(spaceId)
	// console.log(tasks)

	const { tasksList, isTasksLoading } = useTasks()
	const { statusList, isStatusLoading } = useStatus()
	const { tagsList, isTagsLoading } = useTags()
	const setColumnData = useSetAtom(boardColumnsAtom)

	// useEffect(() => {
	// 	if (tasksList?.length && statusList?.length) {
	// 		const temp = {} as Record<string, string[]>
	// 		for (const status of statusList) {
	// 			temp[status.id] = tasksList
	// 				?.filter((t) => t.status_id === status.id)
	// 				?.map((t) => t.id)
	// 		}
	// 		setColumnData(temp)
	// 	}
	// }, [setColumnData, statusList, tasksList])

	async function handleNewTask() {
		const newId = generateId()
		const newTask: ITask = {
			due_date: '',
			priority: TaskPriority.Normal,
			title: 'Untitled',
			description: '',
			status_id: 's-1',
			created_at: dayjs().toISOString(),
			updated_at: dayjs().toISOString(),
			id: newId,
			tag_ids: [],
			sub_tasks: [],
		}
		await db.tasks.add(newTask)
		setSelectedTaskId(newId)
	}

	const isContentLoading = isTagsLoading || isStatusLoading

	return (
		<SidebarProvider>
			<AppSidebar />

			<SidebarInset>
				<div className="relative">
					<div className="flex justify-between items-center px-4 py-4">
						<div className="flex justify-start gap-3 items-center ">
							<SidebarTrigger />
							<h1 className="font-semibold text-xl">Tasks</h1>
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setIsFiltersOpen((o) => !o)}
								className={cn(
									'h-8 px-3 rounded-full text-xs font-medium gap-1 border border-border text-muted-foreground flex items-center justify-center hover:bg-muted hover:text-primary',
									{ 'text-primary': isFiltersOpen }
								)}
							>
								<ListFilter className="h-4 w-4" />
								<span>Filters</span>
							</button>

							<Button
								size="sm"
								className="rounded-full px-3 gap-1"
								onClick={handleNewTask}
							>
								<PlusIcon className="h-3 w-3" />
								<span>Add task</span>
							</Button>
						</div>
					</div>

					<div style={{ height: 'calc(100dvh - 64px)' }} className="overflow-hidden">
						{isFiltersOpen && (
							<div className="py-1 flex items-center justify-between px-3 border-t">
								<TasksFilters />
							</div>
						)}

						{isContentLoading ? (
							<div className="grid place-content-center py-32">
								<Loader className="animate-spin h-5 w-5 text-primary" />
							</div>
						) : (
							<TableView
								tagsList={tagsList}
								statusList={statusList}
								tasksList={tasksList}
								onViewTask={(taskId) => setSelectedTaskId(taskId)}
							/>
						)}
					</div>
				</div>

				{/* {selectedTaskId ? (
					<TaskDetailsDialog
						open={!!selectedTaskId}
						onClose={() => setSelectedTaskId(null)}
						task={tasksList?.find((task) => task.id === selectedTaskId)}
					/>
				) : null} */}
			</SidebarInset>
		</SidebarProvider>
	)
}

export default Home
