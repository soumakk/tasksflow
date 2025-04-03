import { Button } from '@/components/ui/button'
import SaveTaskDrawer from '@/modules/SaveTaskDrawer'
import TableView from '@/modules/TableView'
import { ITask } from '@/types/tasks'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { statusAtom, tagsAtom, tasksAtom } from './lib/atoms'
import Title from './modules/Title'
import ThemeSwitch from './modules/ThemeSwitch'

function App() {
	const tasksList = useAtomValue(tasksAtom)
	const statusList = useAtomValue(statusAtom)
	const tagsList = useAtomValue(tagsAtom)
	const [saveDrawerOpen, setSaveDrawerOpen] = useState(false)
	const [selectedTaskToView, setSelectedTaskToView] = useState<ITask | null>(null)

	return (
		<>
			<div className="relative h-full max-w-5xl mx-auto">
				<div className="flex justify-between items-center px-4 py-3">
					<Title />

					<ThemeSwitch />
				</div>

				<Tabs defaultValue="account" className="">
					<div className="border-b border-border py-2 flex items-center justify-between">
						<TabsList>
							<TabsTrigger value="account">Table View</TabsTrigger>
							<TabsTrigger value="password">Board View</TabsTrigger>
						</TabsList>

						<Button
							size="sm"
							className="rounded-full px-4"
							onClick={() => setSaveDrawerOpen(true)}
						>
							Add task
						</Button>
					</div>
					<TabsContent value="account">
						<TableView
							statusList={statusList}
							tagsList={tagsList}
							// onViewTask={(task) => {
							// 	setSelectedTaskToView(task)
							// 	setSaveDrawerOpen(true)
							// }}
						/>
					</TabsContent>
					<TabsContent value="password">Change your password here.</TabsContent>
				</Tabs>
				<div className="flex px-4 py-2 ">{/* <TasksFilters /> */}</div>
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
