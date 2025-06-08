// src/middleware/auth.middleware.ts
import { createMiddleware } from 'hono/factory'
import * as jwt from 'jsonwebtoken'
import { AuthService } from '../service/auth.service'
import { getCookie } from 'hono/cookie'
import { TokenEncryption } from '@/lib/encrypt'
import { HTTPException } from 'hono/http-exception'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const authService = new AuthService()

export const authMiddleware = createMiddleware(async (c, next) => {
	const encryptedToken = getCookie(c, 'auth_token')
	if (!encryptedToken) {
		return c.json({ error: 'No authentication token found' }, 401)
	}

	const token = TokenEncryption.decrypt(encryptedToken)

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
		throw new HTTPException(401, { message: 'Invalid or expired token' })
	}
})
