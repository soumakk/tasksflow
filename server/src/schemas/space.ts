import { z } from 'zod'

// For creating a new space
export const createSpaceSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(100, { message: 'Title must be at most 100 characters' }),
	icon: z
		.string()
		.max(50, { message: 'Icon must be at most 50 characters' })
		.optional()
		.nullable(),
})

// For updating an existing space (all fields optional)
export const updateSpaceSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'Title is required' })
		.max(100, { message: 'Title must be at most 100 characters' })
		.optional(),
	icon: z
		.string()
		.max(50, { message: 'Icon must be at most 50 characters' })
		.optional()
		.nullable(),
})
