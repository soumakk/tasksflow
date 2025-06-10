import { z } from 'zod'

export const createSubTaskSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(200, { message: 'Title must be at most 200 characters' }),
	completed: z.boolean().optional(), // Defaults to false if omitted
	taskId: z.number().int(),
})

export const updateSubTaskSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(200, { message: 'Title must be at most 200 characters' })
		.optional(),
	completed: z.boolean().optional(),
})
