import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createSubTaskSchema, updateSubTaskSchema } from '@/schemas/subtask'
import { validate } from '@/middleware/zod.middleware'
import { authMiddleware } from '@/middleware/auth.middleware'
import { AuthVariables } from '@/schemas/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.get('/task/:taskId', authMiddleware, async (c) => {
	const user = c.get('user')
	const taskId = Number(c.req.param('taskId'))
	const task = await prisma.task.findUnique({
		where: { id: taskId },
		include: { space: true },
	})
	if (!task || task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Task not found' })
	}
	const subtasks = await prisma.subTask.findMany({
		where: { taskId },
		orderBy: { id: 'asc' },
	})
	return c.json(subtasks)
})

app.get('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const subtask = await prisma.subTask.findUnique({
		where: { id },
		include: { task: { include: { space: true } } },
	})
	if (!subtask || subtask.task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'SubTask not found' })
	}
	return c.json(subtask)
})

app.post('/', authMiddleware, validate(createSubTaskSchema), async (c) => {
	const user = c.get('user')
	const { title, completed = false, taskId } = c.req.valid('json')
	const task = await prisma.task.findUnique({
		where: { id: taskId },
		include: { space: true },
	})
	if (!task || task.space.userId !== user.id) {
		throw new HTTPException(403, { message: 'Not allowed to add subtask to this task' })
	}
	const subtask = await prisma.subTask.create({
		data: { title, completed, taskId },
	})
	return c.json(subtask, 201)
})

app.put('/:id', authMiddleware, validate(updateSubTaskSchema), async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const { title, completed } = c.req.valid('json')
	const subtask = await prisma.subTask.findUnique({
		where: { id },
		include: { task: { include: { space: true } } },
	})
	if (!subtask || subtask.task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'SubTask not found or update failed' })
	}
	const updated = await prisma.subTask.update({
		where: { id },
		data: { title, completed },
	})
	return c.json(updated)
})

app.delete('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const subtask = await prisma.subTask.findUnique({
		where: { id },
		include: { task: { include: { space: true } } },
	})
	if (!subtask || subtask.task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'SubTask not found or delete failed' })
	}
	await prisma.subTask.delete({ where: { id } })
	return c.json({ message: 'SubTask deleted' })
})

export default app
