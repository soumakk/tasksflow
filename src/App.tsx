import { Button } from '@/components/ui/button'
import SaveTaskDrawer from '@/modules/SaveTaskDrawer'
import TableView from '@/modules/TableView'
import { ITask } from '@/types/tasks'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { statusAtom, tagsAtom, tasksAtom } from './lib/atoms'
import TasksFilters from './modules/TasksFilters'

function App() {
	const tasksList = useAtomValue(tasksAtom)
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)
	const [saveDrawerOpen, setSaveDrawerOpen] = useState(false)
	const [selectedTaskToView, setSelectedTaskToView] = useState<ITask | null>(null)

	return (
		<>
			<div className="">
				<div className="">
					<div className="flex justify-between items-center p-4 border-b border-border">
						<h1 className="font-medium text-xl">Tasks</h1>
						{/* <input
							type="text"
							defaultValue="Tasks"
							className="font-medium text-xl outline-none"
						/> */}
					</div>

					<div className="flex px-4 py-2">
						<TasksFilters />
					</div>
				</div>

				<TableView
					tasks={tasksList}
					statusList={statusList}
					tagsList={tagsList}
					// onViewTask={(task) => {
					// 	setSelectedTaskToView(task)
					// 	setSaveDrawerOpen(true)
					// }}
				/>
			</div>

			<div className="fixed bottom-8 right-8">
				<Button className="rounded-full" onClick={() => setSaveDrawerOpen(true)}>
					Add task
				</Button>
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
