import TableView from '@/modules/table/TableView'
import { useAtom, useSetAtom } from 'jotai'
import { Columns3, ListFilter, Loader, PlusIcon, Table } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { boardColumnsAtom, currentTabAtom } from './lib/atoms'
import { useStatus, useTags, useTasks } from './lib/hooks/dexie'
import { cn, generateId } from './lib/utils'
import AddTaskBtn from './modules/AddTaskBtn'
import BoardView from './modules/board/BoardView'
import TasksFilters from './modules/table/TasksFilters'
import ThemeSwitch from './modules/ThemeSwitch'
import Title from './modules/Title'
import TaskDetailsDialog from './modules/task/TaskDetailsDialog'
import { Button } from './components/ui/button'
import { ITask, TaskPriority } from './types/tasks'
import dayjs from 'dayjs'
import { db } from './lib/db'

function App() {
	const [isFiltersOpen, setIsFiltersOpen] = useState(false)
	const [currentTab, setCurrentTab] = useAtom(currentTabAtom)
	const [selectedTaskId, setSelectedTaskId] = useState(null)

	const { tasksList, isTasksLoading } = useTasks()
	const { statusList, isStatusLoading } = useStatus()
	const { tagsList, isTagsLoading } = useTags()
	const setColumnData = useSetAtom(boardColumnsAtom)

	useEffect(() => {
		if (tasksList?.length && statusList?.length) {
			const temp = {} as Record<string, string[]>
			for (const status of statusList) {
				temp[status.id] = tasksList
					?.filter((t) => t.status_id === status.id)
					?.map((t) => t.id)
			}
			setColumnData(temp)
		}
	}, [setColumnData, statusList, tasksList])

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
		}
		await db.tasks.add(newTask)
		setSelectedTaskId(newId)
	}

	const isContentLoading = isTasksLoading || isTagsLoading || isStatusLoading

	return (
		<>
			<div className="relative h-full max-w-5xl mx-auto">
				<div className="flex justify-between items-center px-4 py-4">
					<Title />
					<ThemeSwitch />
				</div>

				<Tabs value={currentTab} onValueChange={setCurrentTab}>
					<div className="py-1 flex items-center justify-between px-2">
						<TabsList>
							<TabsTrigger value="table">
								<Table className="h-4 w-4 mr-1" />
								<span>Table</span>
							</TabsTrigger>
							<TabsTrigger value="board">
								<Columns3 className="h-4 w-4 mr-1" />
								<span>Board</span>
							</TabsTrigger>
						</TabsList>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setIsFiltersOpen((o) => !o)}
								className={cn(
									'h-8 w-8 rounded-full text-muted-foreground flex items-center justify-center hover:bg-muted hover:text-primary',
									{ 'text-primary': isFiltersOpen }
								)}
							>
								<ListFilter className="h-4 w-4" />
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

					{isFiltersOpen && <TasksFilters />}

					{isContentLoading ? (
						<div className="grid place-content-center py-32">
							<Loader className="animate-spin h-5 w-5 text-primary" />
						</div>
					) : (
						<>
							<TabsContent value="table" className="m-0">
								<TableView
									tagsList={tagsList}
									statusList={statusList}
									tasksList={tasksList}
									onViewTask={(taskId) => setSelectedTaskId(taskId)}
								/>
							</TabsContent>
							<TabsContent value="board" className="m-0">
								<BoardView
									tagsList={tagsList}
									statusList={statusList}
									tasksList={tasksList}
									onViewTask={(taskId) => setSelectedTaskId(taskId)}
								/>
							</TabsContent>
						</>
					)}
				</Tabs>
			</div>

			{selectedTaskId ? (
				<TaskDetailsDialog
					open={!!selectedTaskId}
					onClose={() => setSelectedTaskId(null)}
					task={tasksList?.find((task) => task.id === selectedTaskId)}
				/>
			) : null}
		</>
	)
}

export default App
