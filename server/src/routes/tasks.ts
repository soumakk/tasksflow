import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createTaskSchema, updateTaskSchema } from '@/schemas/task'
import { validate } from '@/middleware/zod.middleware'
import { authMiddleware } from '@/middleware/auth.middleware'
import { AuthVariables } from '@/schemas/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.get('/', authMiddleware, async (c) => {
	const user = c.get('user')
	const spaceId = c.req.query('spaceId') ? Number(c.req.query('spaceId')) : undefined
	const where: any = { space: { userId: user.id } }
	if (spaceId) where.spaceId = spaceId
	const tasks = await prisma.task.findMany({
		where,
		include: { tags: true, status: true, subTasks: true },
		orderBy: { id: 'asc' },
	})
	return c.json(tasks)
})

app.get('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const task = await prisma.task.findUnique({
		where: { id },
		include: { tags: true, status: true, subTasks: true, space: true },
	})
	if (!task || task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Task not found' })
	}
	return c.json(task)
})

app.post('/', authMiddleware, validate(createTaskSchema), async (c) => {
	const user = c.get('user')
	const { title, description, priority, dueDate, statusId, spaceId, tagIds } = c.req.valid('json')
	// Check if space belongs to user
	const space = await prisma.space.findUnique({ where: { id: spaceId } })
	if (!space || space.userId !== user.id) {
		throw new HTTPException(403, { message: 'Not allowed to add task to this space' })
	}
	const task = await prisma.task.create({
		data: {
			title,
			description,
			priority,
			dueDate,
			statusId,
			spaceId,
			tags: tagIds
				? {
						connect: tagIds.map((id: number) => ({ id })),
				  }
				: undefined,
		},
		include: { tags: true, status: true, subTasks: true },
	})
	return c.json(task, 201)
})

app.put('/:id', authMiddleware, validate(updateTaskSchema), async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const { title, description, priority, dueDate, statusId, spaceId, tagIds } = c.req.valid('json')
	// Fetch task and check ownership
	const task = await prisma.task.findUnique({
		where: { id },
		include: { space: true },
	})
	if (!task || task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Task not found or update failed' })
	}
	// If changing space, check new space ownership
	if (spaceId && spaceId !== task.spaceId) {
		const newSpace = await prisma.space.findUnique({ where: { id: spaceId } })
		if (!newSpace || newSpace.userId !== user.id) {
			throw new HTTPException(403, { message: 'Not allowed to move task to this space' })
		}
	}
	const updated = await prisma.task.update({
		where: { id },
		data: {
			title,
			description,
			priority,
			dueDate,
			statusId,
			spaceId,
			...(tagIds
				? {
						tags: {
							set: tagIds.map((id: number) => ({ id })),
						},
				  }
				: {}),
		},
		include: { tags: true, status: true, subTasks: true },
	})
	return c.json(updated)
})

app.delete('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const task = await prisma.task.findUnique({
		where: { id },
		include: { space: true },
	})
	if (!task || task.space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Task not found or delete failed' })
	}
	await prisma.task.delete({ where: { id } })
	return c.json({ message: 'Task deleted' })
})

export default app
