import { z } from 'zod'

// For creating a new status
export const createStatusSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(30, { message: 'Name must be at most 30 characters' }),
	color: z
		.string()
		.max(20, { message: 'Color must be at most 20 characters' })
		.optional()
		.nullable(),
})

// For updating an existing status (all fields optional)
export const updateStatusSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(30, { message: 'Name must be at most 30 characters' })
		.optional(),
	color: z
		.string()
		.max(20, { message: 'Color must be at most 20 characters' })
		.optional()
		.nullable(),
})
