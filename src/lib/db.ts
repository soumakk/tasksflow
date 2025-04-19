import { IStatus, ITask } from '@/types/tasks'
import Dexie, { EntityTable, Table } from 'dexie'
import { defaultStatus, defaultTasks } from './data'

export const db = new Dexie('tasksDB') as Dexie & {
	tasks: EntityTable<
		ITask,
		'id' // primary key "id" (for the typings only)
	>
	status: EntityTable<IStatus, 'id'>
}

db.version(1).stores({
	tasks: 'id',
	status: 'id',
})

db.on('populate', populate)

async function populate() {
	await db.tasks.bulkAdd(defaultTasks)
	await db.status.bulkAdd(defaultStatus)
}
