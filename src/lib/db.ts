import { ITask } from '@/types/tasks'
import Dexie, { EntityTable, Table } from 'dexie'
import { defaultTasks } from './data'

export const db = new Dexie('tasksDB') as Dexie & {
	tasks: EntityTable<
		ITask,
		'id' // primary key "id" (for the typings only)
	>
	// settings: EntityTable<{ key: string; value: string }, 'key'>
}

db.version(1).stores({
	tasks: 'id',
	// settings: 'key',
})

db.on('populate', populate)

async function populate() {
	await db.tasks.bulkAdd(defaultTasks)
}
