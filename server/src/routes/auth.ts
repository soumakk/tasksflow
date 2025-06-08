// src/routes/auth.routes.ts
import { TokenEncryption } from '@/lib/encrypt'
import { authMiddleware } from '@/middleware/auth.middleware'
import { validate } from '@/middleware/zod.middleware'
import { AuthVariables, loginSchema, signupSchema } from '@/schemas/auth'
import { AuthService } from '@/service/auth.service'
import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

const auth = new Hono<{ Variables: AuthVariables }>()
const authService = new AuthService()

// Signup Route
auth.post('/signup', validate(signupSchema), async (c) => {
	try {
		const userData = c.req.valid('json')
		const result = await authService.signup(userData)

		const encryptedToken = TokenEncryption.encrypt(result.token)

		setCookie(c, 'auth_token', encryptedToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'None',
			maxAge: 24 * 60 * 60,
			path: '/',
		})

		return c.json(
			{
				success: true,
				message: 'User registered successfully',
				data: {
					user: result.user,
				},
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

		const encryptedToken = TokenEncryption.encrypt(result.token)

		setCookie(c, 'auth_token', encryptedToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'None', // Required for cross-origin requests
			maxAge: 24 * 60 * 60, // 24 hours
			path: '/',
		})

		return c.json({
			success: true,
			message: 'Login successful',
			data: {
				user: result.user,
			},
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

		deleteCookie(c, 'auth_token', {
			path: '/',
			sameSite: 'None',
		})

		return c.json({
			success: true,
			message: result.message,
		})
	} catch (error) {
		throw new HTTPException(500, {
			message: error instanceof Error ? error.message : 'Logout failed',
		})
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

export default auth
