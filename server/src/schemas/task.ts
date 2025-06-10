import { z } from 'zod'

export const createTaskSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(200, { message: 'Title must be at most 200 characters' }),
	description: z
		.string()
		.max(1000, { message: 'Description must be at most 1000 characters' })
		.optional()
		.nullable(),
	priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']),
	dueDate: z.coerce.date().optional().nullable(),
	statusId: z.number().int(),
	spaceId: z.number().int(),
	tagIds: z.array(z.number().int()).optional(), // for connecting tags
})

export const updateTaskSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(200, { message: 'Title must be at most 200 characters' })
		.optional(),
	description: z
		.string()
		.max(1000, { message: 'Description must be at most 1000 characters' })
		.optional()
		.nullable(),
	priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']).optional(),
	dueDate: z.coerce.date().optional().nullable(),
	statusId: z.number().int().optional(),
	spaceId: z.number().int().optional(),
	tagIds: z.array(z.number().int()).optional(), // for updating tags
})
