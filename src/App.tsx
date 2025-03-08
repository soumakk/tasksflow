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
			<div className="max-w-7xl mx-auto px-4 lg:px-8">
				<div className="flex justify-between items-center my-4">
					<h1 className="font-medium text-2xl">Tasks</h1>
					<Button onClick={() => setSaveDrawerOpen(true)}>Add task</Button>
				</div>

				<div className="flex my-4">
					<TasksFilters />
				</div>

				<TableView
					tasks={tasksList}
					statusList={statusList}
					tagsList={tagsList}
					onViewTask={(task) => {
						setSelectedTaskToView(task)
						setSaveDrawerOpen(true)
					}}
				/>
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
