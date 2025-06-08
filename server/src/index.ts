import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import authRoutes from './routes/auth'
import spacesRouter from './routes/spaces'
import statusRouter from './routes/statuses'
import subtasksRouter from './routes/subtasks'
import tagsRouter from './routes/tags'
import tasksRouter from './routes/tasks'
import { AuthService } from './service/auth.service'

const app = new Hono()

// Optional: Use logger middleware for all routes
app.use('*', logger())

app.use(
	'/*',
	cors({
		origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization'],
		exposeHeaders: ['Content-Length'],
		credentials: true,
		maxAge: 3600,
	})
)

app.get('/', (c) => {
	return c.text('Welcome to tasksflow APIs')
})

app.use('*', async (c, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start
	c.header('X-Response-Time', `${ms}ms`)
})

const authService = new AuthService()
authService.cleanupExpiredTokens()

// Mount feature-specific routers
app.route('/api/spaces', spacesRouter)
app.route('/api/statuses', statusRouter)
app.route('/api/tags', tagsRouter)
app.route('/api/tasks', tasksRouter)
app.route('/api/subtasks', subtasksRouter)
app.route('/api/auth', authRoutes)

// Global error handler (optional, but recommended)
app.onError((err, c) => {
	return c.json(
		{ error: err?.message ?? 'Internal Server Error', success: false },
		err?.status ?? 500
	)
})

export default {
	port: 5000,
	fetch: app.fetch,
}
