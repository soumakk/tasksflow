import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '@/lib/prisma'
import { createTagSchema, updateTagSchema } from '@/schemas/tag'
import { validate } from '@/middleware/zod.middleware'

export const app = new Hono()

// Get all tags (optionally filter by spaceId)
app.get('/', async (c) => {
	const spaceId = c.req.query('spaceId')
	const where = spaceId ? { spaceId: Number(spaceId) } : {}
	const tags = await prisma.tag.findMany({ where })
	return c.json(tags)
})

// Get a single tag by ID
app.get('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	const tag = await prisma.tag.findUnique({ where: { id } })
	if (!tag) throw new HTTPException(404, { message: `Tag ${id} not found` })
	return c.json(tag)
})

// Create a new tag
app.post('/', validate(createTagSchema), async (c) => {
	const { name, color, spaceId } = c.req.valid('json')
	const tag = await prisma.tag.create({
		data: { name, color, spaceId },
	})
	return c.json(tag, 201)
})

// Update a tag
app.put('/:id', validate(updateTagSchema), async (c) => {
	const id = Number(c.req.param('id'))
	const { name, color } = c.req.valid('json')
	try {
		const tag = await prisma.tag.update({
			where: { id },
			data: { name, color },
		})
		return c.json(tag)
	} catch (err) {
		throw new HTTPException(404, { message: `Tag ${id} not found or update failed` })
	}
})

// Delete a tag
app.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	try {
		await prisma.tag.delete({ where: { id } })
		return c.json({ message: 'Tag deleted' })
	} catch (err) {
		throw new HTTPException(404, { message: `Tag ${id} not found or delete failed` })
	}
})

export default app
