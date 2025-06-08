import { z } from 'zod'

export const createSpaceSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	icon: z.string().optional(),
})

export const updateSpaceSchema = z.object({
	title: z.string().min(1, 'Title is required').optional(),
	icon: z.string().optional(),
})
