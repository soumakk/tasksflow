// types.ts
export type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW'

export interface User {
	id: number
	email: string
	name: string
	password: string
	created_at: Date
	updated_at: Date
	tokens: Token[]
}

export interface Token {
	id: number
	token: string
	userId: number
	created_at: Date
	expires_at: Date
	user: User
}

export interface Space {
	id: number
	title: string
	icon?: string | null
	created_at: Date
	updated_at: Date
	statuses?: Status[]
	tags?: Tag[]
	tasks?: Task[]
}

export interface Task {
	id: number
	title: string
	description?: string | null
	priority: Priority
	due_date: Date
	created_at: Date
	updated_at: Date
	statusId: number
	spaceId: number
	status: Status
	space: Space
	tags: Tag[]
	subTasks: SubTask[]
}

export interface SubTask {
	id: number
	title: string
	completed: boolean
	created_at: Date
	updated_at: Date
	taskId: number
	task: Task
}

export interface Status {
	id: number
	name: string
	color: string
	spaceId: number
	space: Space
	tasks: Task[]
}

export interface Tag {
	id: number
	name: string
	color: string
	spaceId: number
	space: Space
	tasks: Task[]
}
