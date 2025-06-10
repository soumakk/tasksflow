import { z } from 'zod'

// For creating a new tag
export const createTagSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name must be at most 50 characters' }),
	color: z
		.string()
		.max(20, { message: 'Color must be at most 20 characters' })
		.optional()
		.nullable(),
})

// For updating an existing tag (all fields optional)
export const updateTagSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name must be at most 50 characters' })
		.optional(),
	color: z
		.string()
		.max(20, { message: 'Color must be at most 20 characters' })
		.optional()
		.nullable(),
})
