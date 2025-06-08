// src/services/auth.service.ts
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const JWT_EXPIRES_IN = '24h'

export class AuthService {
	async signup(userData: { email: string; name: string; password: string }) {
		const { email, name, password } = userData

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			throw new Error('User with this email already exists')
		}

		// Hash password
		const saltRounds = 12
		const hashedPassword = await bcrypt.hash(password, saltRounds)

		// Create user
		const newUser = await prisma.user.create({
			data: {
				email,
				name,
				password: hashedPassword,
			},
			select: {
				id: true,
				email: true,
				name: true,
			},
		})

		// Generate JWT token
		const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		})

		// Store token in database
		const expiresAt = new Date()
		expiresAt.setHours(expiresAt.getHours() + 24)

		await prisma.token.create({
			data: {
				token,
				userId: newUser.id,
				expires_at: expiresAt,
			},
		})

		return {
			user: newUser,
			token,
		}
	}

	async login(credentials: { email: string; password: string }) {
		const { email, password } = credentials

		// Find user by email
		const user = await prisma.user.findUnique({
			where: { email },
		})

		if (!user) {
			throw new Error('Invalid email or password')
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) {
			throw new Error('Invalid email or password')
		}

		// Generate JWT token
		const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
			expiresIn: JWT_EXPIRES_IN,
		})

		// Store token in database
		const expiresAt = new Date()
		expiresAt.setHours(expiresAt.getHours() + 24)

		await prisma.token.create({
			data: {
				token,
				userId: user.id,
				expires_at: expiresAt,
			},
		})

		return {
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
			token,
		}
	}

	async logout(token: string) {
		// Remove token from database
		await prisma.token.delete({
			where: { token },
		})

		return { message: 'Logged out successfully' }
	}

	async validateToken(token: string) {
		// Check if token exists in database and is not expired
		const tokenRecord = await prisma.token.findUnique({
			where: { token },
			include: { user: true },
		})

		if (!tokenRecord || tokenRecord.expires_at < new Date()) {
			return null
		}

		return tokenRecord.user
	}

	async cleanupExpiredTokens() {
		// Clean up expired tokens
		await prisma.token.deleteMany({
			where: {
				expires_at: {
					lt: new Date(),
				},
			},
		})
	}
}
