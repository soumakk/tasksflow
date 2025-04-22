import TableView from '@/modules/table/TableView'
import { useLiveQuery } from 'dexie-react-hooks'
import { useAtom, useSetAtom } from 'jotai'
import { Columns3, ListFilter, Table } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { boardColumnsAtom, currentTabAtom } from './lib/atoms'
import { db } from './lib/db'
import { cn } from './lib/utils'
import AddTaskBtn from './modules/AddTaskBtn'
import BoardView from './modules/board/BoardView'
import TasksFilters from './modules/table/TasksFilters'
import ThemeSwitch from './modules/ThemeSwitch'
import Title from './modules/Title'

function App() {
	const [isFiltersOpen, setIsFiltersOpen] = useState(false)
	const [currentTab, setCurrentTab] = useAtom(currentTabAtom)

	const tasksList = useLiveQuery(() => db.tasks.toArray())
	const statusList = useLiveQuery(() => db.status.toArray())
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

	// async function addNewTask() {
	// 	const newTask: ITask = {
	// 		due_date: '',
	// 		priority: TaskPriority.Normal,
	// 		title: '',
	// 		description: '',
	// 		status_id: '1',
	// 		created_at: dayjs().toISOString(),
	// 		updated_at: dayjs().toISOString(),
	// 		id: generateId(),
	// 		tag_ids: [],
	// 	}
	// 	await db.tasks.add(newTask)
	// }

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

							<AddTaskBtn />
						</div>
					</div>

					{isFiltersOpen && <TasksFilters />}

					<TabsContent value="table" className="m-0">
						<TableView />
					</TabsContent>
					<TabsContent value="board" className="m-0">
						<BoardView />
					</TabsContent>
				</Tabs>
			</div>
		</>
	)
}

export default App
