import { z } from 'zod'

export const createSubTaskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	completed: z.boolean().optional(),
	taskId: z.number().int().positive(),
})

export const updateSubTaskSchema = z.object({
	title: z.string().min(1, 'Title is required').optional(),
	completed: z.boolean().optional(),
})
