import { z } from 'zod'

export const createTaskSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']),
	due_date: z.string().datetime({ message: 'Must be a valid ISO date string' }),
	statusId: z.number().int().positive(),
	spaceId: z.number().int().positive(),
	tagIds: z.array(z.number().int().positive()).optional(),
})

export const updateTaskSchema = z.object({
	title: z.string().min(1, 'Title is required').optional(),
	description: z.string().optional(),
	priority: z.enum(['URGENT', 'HIGH', 'NORMAL', 'LOW']).optional(),
	due_date: z.string().datetime({ message: 'Must be a valid ISO date string' }).optional(),
	statusId: z.number().int().positive().optional(),
	tagIds: z.array(z.number().int().positive()).optional(),
})
