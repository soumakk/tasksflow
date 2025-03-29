import { Button } from '@/components/ui/button'
import SaveTaskDrawer from '@/modules/SaveTaskDrawer'
import TableView from '@/modules/TableView'
import { ITask } from '@/types/tasks'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { statusAtom, tagsAtom, tasksAtom } from './lib/atoms'
import TasksFilters from './modules/TasksFilters'
import { db } from './lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

function App() {
	const tasksList = useAtomValue(tasksAtom)
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)
	const [saveDrawerOpen, setSaveDrawerOpen] = useState(false)
	const [selectedTaskToView, setSelectedTaskToView] = useState<ITask | null>(null)

	return (
		<>
			<div className="relative h-full flex flex-col overflow-hidden">
				<div className="flex justify-between items-center px-4 py-2 border-b border-border">
					<h1 className="font-medium text-lg">Tasks</h1>
					{/* <input
							type="text"
							defaultValue="Tasks"
							className="font-medium text-xl outline-none"
						/> */}

					<Button
						size="sm"
						className="rounded-full px-4"
						onClick={() => setSaveDrawerOpen(true)}
					>
						Add task
					</Button>
				</div>

				<div className="flex px-4 py-2 ">
					<TasksFilters />
				</div>

				<TableView
					statusList={statusList}
					tagsList={tagsList}
					// onViewTask={(task) => {
					// 	setSelectedTaskToView(task)
					// 	setSaveDrawerOpen(true)
					// }}
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
