import { Button } from '@/components/ui/button'
import SaveTaskDrawer from '@/modules/SaveTaskDrawer'
import TableView from '@/modules/TableView'
import { ITask, TaskPriority } from '@/types/tasks'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { statusAtom, tagsAtom, tasksAtom } from './lib/atoms'
import Title from './modules/Title'
import ThemeSwitch from './modules/ThemeSwitch'
import dayjs from 'dayjs'
import { generateId } from './lib/utils'
import { db } from './lib/db'
import { Columns3, Table } from 'lucide-react'

function App() {
	const tasksList = useAtomValue(tasksAtom)
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)
	const [saveDrawerOpen, setSaveDrawerOpen] = useState(false)
	const [selectedTaskToView, setSelectedTaskToView] = useState<ITask | null>(null)

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

				<Tabs defaultValue="table" className="">
					<div className="py-1 flex items-center justify-between">
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

						<Button
							size="sm"
							className="rounded-full px-4"
							onClick={() => addNewTask()}
						>
							Add task
						</Button>
					</div>
					<TabsContent value="table" className="m-0">
						<TableView
							statusList={statusList}
							tagsList={tagsList}
							// onViewTask={(task) => {
							// 	setSelectedTaskToView(task)
							// 	setSaveDrawerOpen(true)
							// }}
						/>
					</TabsContent>
					<TabsContent value="board">
						<p className="text-center py-10 text-sm text-muted-foreground">
							Coming soon
						</p>
					</TabsContent>
				</Tabs>
				{/* <div className="flex px-4 py-2 ">
					<TasksFilters />
					</div> */}
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
