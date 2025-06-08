// src/routes/auth.routes.ts
import prisma from '@/lib/prisma'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validate } from '@/middleware/zod.middleware'
import { AuthVariables, loginSchema, signupSchema } from '@/schemas/auth'
import { AuthService } from '@/service/auth.service'
import * as jwt from 'jsonwebtoken'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

const auth = new Hono<{ Variables: AuthVariables }>()
const authService = new AuthService()

// Signup Route
auth.post('/signup', validate(signupSchema), async (c) => {
	try {
		const userData = c.req.valid('json')
		const result = await authService.signup(userData)

		return c.json(
			{
				success: true,
				message: 'User registered successfully',
				data: result,
			},
			201
		)
	} catch (error) {
		throw new HTTPException(400, {
			message: error instanceof Error ? error.message : 'Registration failed',
		})
	}
})

// Login Route
auth.post('/login', validate(loginSchema), async (c) => {
	try {
		const credentials = c.req.valid('json')
		const result = await authService.login(credentials)

		return c.json({
			success: true,
			message: 'Login successful',
			data: result,
		})
	} catch (error) {
		throw new HTTPException(401, {
			message: error instanceof Error ? error.message : 'Login failed',
		})
	}
})

// Logout Route
auth.post('/logout', authMiddleware, async (c) => {
	try {
		const token = c.get('token')
		const result = await authService.logout(token)

		return c.json({
			success: true,
			message: result.message,
		})
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Logout failed',
			},
			500
		)
	}
})

// Get Current User Route (Protected)
auth.get('/me', authMiddleware, async (c) => {
	const user = c.get('user')
	return c.json({
		success: true,
		data: {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		},
	})
})

// Refresh Token Route
auth.post('/refresh', authMiddleware, async (c) => {
	try {
		const user = c.get('user')
		const oldToken = c.get('token')

		// Generate new token
		const newToken = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET || 'your-secret-key',
			{ expiresIn: '24h' }
		)

		// Update token in database
		const expiresAt = new Date()
		expiresAt.setHours(expiresAt.getHours() + 24)

		await prisma.token.update({
			where: { token: oldToken },
			data: {
				token: newToken,
				expires_at: expiresAt,
			},
		})

		return c.json({
			success: true,
			data: { token: newToken },
		})
	} catch (error) {
		return c.json(
			{
				success: false,
				error: 'Token refresh failed',
			},
			500
		)
	}
})

export default auth
