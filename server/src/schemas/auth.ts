import { z } from 'zod'

export const signupSchema = z.object({
	email: z.string().email('Invalid email address'),
	name: z.string().min(1, 'Name is required').max(100),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>

export interface User {
	id: number
	email: string
	name: string
	created_at: Date
}

export type AuthVariables = {
	user: User
	token: string
}
