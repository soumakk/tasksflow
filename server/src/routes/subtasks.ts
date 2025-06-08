import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '../lib/prisma'
import { validate } from '../lib/zod'
import { createSubTaskSchema, updateSubTaskSchema } from '../schemas/subtask'

export const subtasksRouter = new Hono()

// Get all subtasks for a task
subtasksRouter.get('/', async (c) => {
	const taskId = c.req.query('taskId')
	if (!taskId) throw new HTTPException(400, { message: 'taskId is required' })
	const subtasks = await prisma.subTask.findMany({
		where: { taskId: Number(taskId) },
		orderBy: { created_at: 'asc' },
	})
	return c.json(subtasks)
})

// Get a single subtask by ID
subtasksRouter.get('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	const subtask = await prisma.subTask.findUnique({ where: { id } })
	if (!subtask) throw new HTTPException(404, { message: 'Subtask not found' })
	return c.json(subtask)
})

// Create a new subtask
subtasksRouter.post('/', validate(createSubTaskSchema), async (c) => {
	const { title, completed = false, taskId } = c.req.valid('json')
	// Validate parent task exists
	const task = await prisma.task.findUnique({ where: { id: taskId } })
	if (!task) throw new HTTPException(404, { message: 'Parent task not found' })

	const subtask = await prisma.subTask.create({
		data: { title, completed, taskId },
	})
	return c.json(subtask, 201)
})

// Update a subtask
subtasksRouter.put('/:id', validate(updateSubTaskSchema), async (c) => {
	const id = Number(c.req.param('id'))
	const { title, completed } = c.req.valid('json')
	const data: any = {}
	if (title !== undefined) data.title = title
	if (completed !== undefined) data.completed = completed

	try {
		const subtask = await prisma.subTask.update({
			where: { id },
			data,
		})
		return c.json(subtask)
	} catch (err) {
		throw new HTTPException(404, { message: 'Subtask not found or update failed' })
	}
})

// Delete a subtask
subtasksRouter.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	try {
		await prisma.subTask.delete({ where: { id } })
		return c.json({ message: 'Subtask deleted' })
	} catch (err) {
		throw new HTTPException(404, { message: 'Subtask not found or delete failed' })
	}
})
