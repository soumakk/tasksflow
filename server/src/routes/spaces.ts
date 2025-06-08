import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import prisma from '../lib/prisma'
import { createSpaceSchema, updateSpaceSchema } from '../schemas/space'
import { validate } from '../lib/zod'

export const spacesRouter = new Hono()

// Get all spaces
spacesRouter.get('/', async (c) => {
	const spaces = await prisma.space.findMany({
		include: {
			statuses: true,
			tags: true,
			tasks: true,
		},
		orderBy: { id: 'asc' },
	})
	return c.json(spaces)
})

// Get a single space by ID
spacesRouter.get('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	const space = await prisma.space.findUnique({
		where: { id },
		include: {
			statuses: true,
			tags: true,
			tasks: true,
		},
	})
	if (!space) throw new HTTPException(404, { message: 'Space not found' })
	return c.json(space)
})

// Create a new space
spacesRouter.post('/', validate(createSpaceSchema), async (c) => {
	const { title, icon } = c.req.valid('json')
	const space = await prisma.space.create({
		data: { title, icon },
	})
	return c.json(space, 201)
})

// Update a space
spacesRouter.put('/:id', validate(updateSpaceSchema), async (c) => {
	const id = Number(c.req.param('id'))
	const { title, icon } = c.req.valid('json')
	try {
		const space = await prisma.space.update({
			where: { id },
			data: { title, icon },
		})
		return c.json(space)
	} catch (err) {
		throw new HTTPException(404, { message: 'Space not found or update failed' })
	}
})

// Delete a space
spacesRouter.delete('/:id', async (c) => {
	const id = Number(c.req.param('id'))
	try {
		await prisma.space.delete({ where: { id } })
		return c.json({ message: 'Space deleted' })
	} catch (err) {
		throw new HTTPException(404, { message: 'Space not found or delete failed' })
	}
})
