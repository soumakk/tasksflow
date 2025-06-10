import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createStatusSchema, updateStatusSchema } from '@/schemas/status'
import { validate } from '@/middleware/zod.middleware'
import { authMiddleware } from '@/middleware/auth.middleware'
import { AuthVariables } from '@/schemas/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.get('/', authMiddleware, async (c) => {
	const user = c.get('user')
	const statuses = await prisma.status.findMany({
		where: { userId: user.id },
		orderBy: { id: 'asc' },
	})
	return c.json(statuses)
})

app.get('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const status = await prisma.status.findUnique({
		where: { id },
	})
	if (!status || status.userId !== user.id) {
		throw new HTTPException(404, { message: 'Status not found' })
	}
	return c.json(status)
})

app.post('/', authMiddleware, validate(createStatusSchema), async (c) => {
	const user = c.get('user')
	const { name, color } = c.req.valid('json')
	const status = await prisma.status.create({
		data: { name, color, userId: user.id },
	})
	return c.json(status, 201)
})

app.put('/:id', authMiddleware, validate(updateStatusSchema), async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const { name, color } = c.req.valid('json')
	const status = await prisma.status.findUnique({ where: { id } })
	if (!status || status.userId !== user.id) {
		throw new HTTPException(404, { message: 'Status not found or update failed' })
	}
	const updated = await prisma.status.update({
		where: { id },
		data: { name, color },
	})
	return c.json(updated)
})

app.delete('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const status = await prisma.status.findUnique({ where: { id } })
	if (!status || status.userId !== user.id) {
		throw new HTTPException(404, { message: 'Status not found or delete failed' })
	}
	await prisma.status.delete({ where: { id } })
	return c.json({ message: 'Status deleted' })
})

export default app
