import { z } from 'zod'

export const createStatusSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	color: z.string().min(1, 'Color is required'),
	spaceId: z.number().int().positive(),
})

export const updateStatusSchema = z.object({
	name: z.string().min(1, 'Name is required').optional(),
	color: z.string().min(1, 'Color is required').optional(),
})
