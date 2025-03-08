import { Button } from '@/components/ui/button'
import AddTaskDrawer from '@/modules/AddTaskDrawer'
import TableView from '@/modules/TableView'
import { ITask } from '@/types/tasks'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { statusAtom, tagsAtom, tasksAtom } from './lib/atoms'
import TasksFilters from './modules/TasksFilters'

function App() {
	const [tasks, setTasks] = useAtom(tasksAtom)
	const [status, setStatus] = useAtom(statusAtom)
	const [tags, setTags] = useAtom(tagsAtom)
	const [addDrawerOpen, setAddDrawerOpen] = useState(false)
	const [selectedTaskToView, setSelectedTaskToView] = useState<ITask | null>(null)

	return (
		<>
			<div className="max-w-7xl mx-auto px-4 lg:px-8">
				<div className="flex justify-between items-center my-4">
					<h1 className="font-medium text-2xl">Tasks</h1>
					<Button onClick={() => setAddDrawerOpen(true)}>Add task</Button>
				</div>

				<div className="flex my-4">
					<TasksFilters />
				</div>

				<TableView
					tasks={tasks}
					// isTasksLoading={isLoading}
					statusList={status}
					tagsList={tags}
					onViewTask={(task) => setSelectedTaskToView(task)}
				/>
			</div>

			<AddTaskDrawer open={addDrawerOpen} onClose={() => setAddDrawerOpen(false)} />
		</>
	)
}

export default App
