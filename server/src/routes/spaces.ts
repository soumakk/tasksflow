import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createSpaceSchema, updateSpaceSchema } from '@/schemas/space'
import { validate } from '@/middleware/zod.middleware'
import { authMiddleware } from '@/middleware/auth.middleware'
import { AuthVariables } from '@/schemas/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.get('/', authMiddleware, async (c) => {
	const user = c.get('user')
	const spaces = await prisma.space.findMany({
		where: { userId: user.id },
		orderBy: { id: 'asc' },
	})
	return c.json(spaces)
})

app.get('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const space = await prisma.space.findUnique({
		where: { id },
		include: { tasks: true },
	})
	if (!space || space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Space not found' })
	}
	return c.json(space)
})

app.post('/', authMiddleware, validate(createSpaceSchema), async (c) => {
	const user = c.get('user')
	const { title, icon } = c.req.valid('json')
	const space = await prisma.space.create({
		data: { title, icon, userId: user.id },
	})
	return c.json(space, 201)
})

app.put('/:id', authMiddleware, validate(updateSpaceSchema), async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const { title, icon } = c.req.valid('json')
	// Check ownership
	const space = await prisma.space.findUnique({ where: { id } })
	if (!space || space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Space not found or update failed' })
	}
	const updated = await prisma.space.update({
		where: { id },
		data: { title, icon },
	})
	return c.json(updated)
})

app.delete('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const space = await prisma.space.findUnique({ where: { id } })
	if (!space || space.userId !== user.id) {
		throw new HTTPException(404, { message: 'Space not found or delete failed' })
	}
	await prisma.space.delete({ where: { id } })
	return c.json({ message: 'Space deleted' })
})

export default app
