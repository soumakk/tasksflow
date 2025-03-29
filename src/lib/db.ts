import { ITask } from '@/types/tasks'
import Dexie, { EntityTable } from 'dexie'
import { defaultTasks } from './data'

export const db = new Dexie('tasksDB') as Dexie & {
	tasks: EntityTable<
		ITask,
		'id' // primary key "id" (for the typings only)
	>
}

db.version(1).stores({
	tasks: 'id',
})

db.on('populate', populate)

async function populate() {
	await db.tasks.bulkAdd(defaultTasks)
}
