import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createTaskSchema, updateTaskSchema } from '@/schemas/task'
import { validate } from '@/middleware/zod.middleware'

export const app = new Hono()

// Get all tasks (optionally filter by spaceId or statusId)
app.get('/', async (c) => {
	const spaceId = c.req.query('spaceId')
	const statusId = c.req.query('statusId')
	const where: any = {}
	if (spaceId) where.spaceId = Number(spaceId)
	if (statusId) where.statusId = Number(statusId)
	const tasks = await prisma.task.findMany({
		where,
		include: {
			tags: true,
			status: true,
			subTasks: true,
		},
		orderBy: { created_at: 'desc' },
	})
	return c.json(tasks)
})

// Get a single task by ID
app.get('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	const task = await prisma.task.findUnique({
		where: { id },
		include: {
			tags: true,
			status: true,
		},
	})
	if (!task) throw new HTTPException(404, { message: 'Task not found' })
	return c.json(task)
})

// Create a new task (with tags)
app.post('/', validate(createTaskSchema), async (c) => {
	const { title, description, priority, due_date, statusId, spaceId, tagIds } =
		c.req.valid('json')
	// Ensure referenced status and space exist
	const status = await prisma.status.findUnique({ where: { id: statusId } })
	if (!status) throw new HTTPException(404, { message: 'Status not found' })
	const space = await prisma.space.findUnique({ where: { id: spaceId } })
	if (!space) throw new HTTPException(404, { message: 'Space not found' })

	const task = await prisma.task.create({
		data: {
			title,
			description,
			priority,
			due_date: new Date(due_date),
			statusId,
			spaceId,
			tags:
				tagIds && Array.isArray(tagIds)
					? { connect: tagIds.map((id: number) => ({ id })) }
					: undefined,
		},
		include: {
			tags: true,
			status: true,
		},
	})
	return c.json(task, 201)
})

// Update a task (including tags)
app.put('/:id', validate(updateTaskSchema), async (c) => {
	const id = Number(c.req.param('id'))
	const { title, description, priority, due_date, statusId, tagIds } = c.req.valid('json')
	// Prepare update data
	const data: any = {}
	if (title !== undefined) data.title = title
	if (description !== undefined) data.description = description
	if (priority !== undefined) data.priority = priority
	if (due_date !== undefined) data.due_date = new Date(due_date)
	if (statusId !== undefined) data.statusId = statusId
	if (tagIds !== undefined && Array.isArray(tagIds)) {
		data.tags = { set: tagIds.map((id: number) => ({ id })) }
	}

	try {
		const task = await prisma.task.update({
			where: { id },
			data,
			include: {
				tags: true,
				status: true,
			},
		})
		return c.json(task)
	} catch (err) {
		throw new HTTPException(404, { message: 'Task not found or update failed' })
	}
})

// Delete a task
app.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	try {
		await prisma.task.delete({ where: { id } })
		return c.json({ message: 'Task deleted' })
	} catch (err) {
		throw new HTTPException(404, { message: 'Task not found or delete failed' })
	}
})

export default app
