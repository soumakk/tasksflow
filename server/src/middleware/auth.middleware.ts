// src/middleware/auth.middleware.ts
import { createMiddleware } from 'hono/factory'
import * as jwt from 'jsonwebtoken'
import { AuthService } from '../service/auth.service'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const authService = new AuthService()

export const authMiddleware = createMiddleware(async (c, next) => {
	const authHeader = c.req.header('Authorization')

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return c.json({ error: 'Authorization token required' }, 401)
	}

	const token = authHeader.substring(7)

	try {
		// Verify JWT token
		const decoded = jwt.verify(token, JWT_SECRET) as any

		// Validate token against database
		const user = await authService.validateToken(token)

		if (!user) {
			return c.json({ error: 'Invalid or expired token' }, 401)
		}

		c.set('user', user)
		c.set('token', token)

		await next()
	} catch (error) {
		return c.json({ error: 'Invalid or expired token' }, 401)
	}
})
