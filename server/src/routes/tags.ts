import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createTagSchema, updateTagSchema } from '@/schemas/tag'
import { validate } from '@/middleware/zod.middleware'
import { authMiddleware } from '@/middleware/auth.middleware'
import { AuthVariables } from '@/schemas/auth'

const app = new Hono<{ Variables: AuthVariables }>()

app.get('/', authMiddleware, async (c) => {
	const user = c.get('user')
	const tags = await prisma.tag.findMany({
		where: { userId: user.id },
		orderBy: { id: 'asc' },
	})
	return c.json(tags)
})

app.get('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const tag = await prisma.tag.findUnique({
		where: { id },
	})
	if (!tag || tag.userId !== user.id) {
		throw new HTTPException(404, { message: 'Tag not found' })
	}
	return c.json(tag)
})

app.post('/', authMiddleware, validate(createTagSchema), async (c) => {
	const user = c.get('user')
	const { name, color } = c.req.valid('json')
	const tag = await prisma.tag.create({
		data: { name, color, userId: user.id },
	})
	return c.json(tag, 201)
})

app.put('/:id', authMiddleware, validate(updateTagSchema), async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const { name, color } = c.req.valid('json')
	const tag = await prisma.tag.findUnique({ where: { id } })
	if (!tag || tag.userId !== user.id) {
		throw new HTTPException(404, { message: 'Tag not found or update failed' })
	}
	const updated = await prisma.tag.update({
		where: { id },
		data: { name, color },
	})
	return c.json(updated)
})

app.delete('/:id', authMiddleware, async (c) => {
	const user = c.get('user')
	const id = Number(c.req.param('id'))
	const tag = await prisma.tag.findUnique({ where: { id } })
	if (!tag || tag.userId !== user.id) {
		throw new HTTPException(404, { message: 'Tag not found or delete failed' })
	}
	await prisma.tag.delete({ where: { id } })
	return c.json({ message: 'Tag deleted' })
})

export default app
