import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '../lib/prisma'
import { validate } from '../lib/zod'
import { createStatusSchema, updateStatusSchema } from '../schemas/status'

export const statusRouter = new Hono()

// Get all statuses (optionally filter by spaceId)
statusRouter.get('/', async (c) => {
	const spaceId = c.req.query('spaceId')
	const where = spaceId ? { spaceId: Number(spaceId) } : {}
	const statuses = await prisma.status.findMany({ where })
	return c.json(statuses)
})

// Get a single status by ID
statusRouter.get('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	const status = await prisma.status.findUnique({ where: { id } })
	if (!status) throw new HTTPException(404, { message: `Status ${id} not found` })
	return c.json(status)
})

// Create a new status
statusRouter.post('/', validate(createStatusSchema), async (c) => {
	const { name, color, spaceId } = c.req.valid('json')
	const status = await prisma.status.create({
		data: { name, color, spaceId },
	})
	return c.json(status, 201)
})

// Update a status
statusRouter.put('/:id', validate(updateStatusSchema), async (c) => {
	const id = Number(c.req.param('id'))
	const { name, color } = c.req.valid('json')
	try {
		const status = await prisma.status.update({
			where: { id },
			data: { name, color },
		})
		return c.json(status)
	} catch (err) {
		throw new HTTPException(404, { message: `Status ${id} not found or update failed` })
	}
})

// Delete a status
statusRouter.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	try {
		await prisma.status.delete({ where: { id } })
		return c.json({ message: 'Status deleted' })
	} catch (err) {
		throw new HTTPException(404, { message: `Status ${id} not found or delete failed` })
	}
})
