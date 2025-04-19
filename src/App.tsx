import { Button } from '@/components/ui/button'
import SaveTaskDrawer from '@/modules/SaveTaskDrawer'
import TableView from '@/modules/table/TableView'
import { ITask, TaskPriority } from '@/types/tasks'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import { Columns3, ListFilter, Table } from 'lucide-react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { searchQueryAtom } from './lib/atoms'
import { db } from './lib/db'
import { cn, generateId } from './lib/utils'
import BoardView from './modules/board/BoardView'
import TasksFilters from './modules/table/TasksFilters'
import ThemeSwitch from './modules/ThemeSwitch'
import Title from './modules/Title'

function App() {
	const [saveDrawerOpen, setSaveDrawerOpen] = useState(false)
	const [selectedTaskToView, setSelectedTaskToView] = useState<ITask | null>(null)
	const [isFiltersOpen, setIsFiltersOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)

	async function addNewTask() {
		const newTask: ITask = {
			due_date: '',
			priority: TaskPriority.Normal,
			title: '',
			description: '',
			status_id: '1',
			created_at: dayjs().toISOString(),
			updated_at: dayjs().toISOString(),
			id: generateId(),
			tag_ids: [],
		}
		await db.tasks.add(newTask)
	}

	return (
		<>
			<div className="relative h-full max-w-5xl mx-auto">
				<div className="flex justify-between items-center px-4 py-4">
					<Title />

					<ThemeSwitch />
				</div>

				<Tabs defaultValue="board" className="">
					<div className="py-1 flex items-center justify-between px-2">
						{/* <div>
							<div className="flex items-center">
								<Search className="h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Search tasks"
									className="h-8 text-xs border-0 placeholder:text-xs focus-visible:ring-0"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div> */}
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
								className="rounded-full px-4"
								onClick={() => addNewTask()}
							>
								Add task
							</Button>
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

			<SaveTaskDrawer
				open={saveDrawerOpen}
				onClose={() => {
					setSaveDrawerOpen(false)
					setSelectedTaskToView(null)
				}}
				selectedTask={selectedTaskToView}
			/>
		</>
	)
}

export default App
