import { IStatus, ITag, ITask } from '@/types/tasks'
import Dexie, { EntityTable } from 'dexie'
import { defaultStatus, defaultTags, defaultTasks } from './data'

export const db = new Dexie('tasksDB') as Dexie & {
	tasks: EntityTable<
		ITask,
		'id' // primary key "id" (for the typings only)
	>
	status: EntityTable<IStatus, 'id'>
	tags: EntityTable<ITag, 'id'>
}

db.version(1).stores({
	tasks: 'id',
	status: 'id',
	tags: 'id',
})

db.on('populate', populate)

async function populate() {
	await db.tasks.bulkAdd(defaultTasks)
	await db.status.bulkAdd(defaultStatus)
	await db.tags.bulkAdd(defaultTags)
}
