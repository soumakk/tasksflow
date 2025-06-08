// frontend/src/contexts/AuthContext.tsx
import { getUrl } from '@/services/api'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router'

interface User {
	id: number
	email: string
	name: string
}

interface SignupData {
	email: string
	name: string
	password: string
}

interface LoginData {
	email: string
	password: string
}

interface AuthContextType {
	user: User | null
	isAuthenticated: boolean
	loading: boolean
	login: (credentials: LoginData) => Promise<void>
	signup: (userData: SignupData) => Promise<void>
	logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	// Check if user is authenticated
	const isAuthenticated = !!user

	// Check authentication status on app load
	useEffect(() => {
		checkAuthStatus()
	}, [])

	const checkAuthStatus = async () => {
		try {
			const response = await fetch(getUrl('/auth/me'), {
				method: 'GET',
				credentials: 'include', // Important: sends cookies
				headers: {
					'Content-Type': 'application/json',
				},
			})

			if (response.ok) {
				const data = await response.json()
				setUser(data.data.user)
			} else {
				setUser(null)
			}
		} catch (err) {
			console.error('Auth check failed:', err)
			setUser(null)
		} finally {
			setLoading(false)
		}
	}

	// Login function
	const login = async (credentials: LoginData) => {
		try {
			const response = await fetch(getUrl('/auth/login'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(credentials),
				credentials: 'include',
			})

			const data = await response.json()

			if (response.ok) {
				setUser(data.data.user)
			} else {
				throw new Error(data.error || 'Login failed')
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Login failed'
			throw new Error(errorMessage)
		}
	}

	// Signup function
	const signup = async (userData: SignupData) => {
		try {
			const response = await fetch(getUrl('/auth/signup'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			})

			const data = await response.json()

			if (response.ok) {
				setUser(data.data.user)
			} else {
				throw new Error(data.error || 'Signup failed')
			}
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Signup failed'
			throw new Error(errorMessage)
		}
	}

	// Logout function
	const logout = async () => {
		try {
			// Call logout endpoint to invalidate token on server
			await fetch(getUrl('/auth/logout'), {
				method: 'POST',
				credentials: 'include',
			})
		} catch (err) {
			console.error('Logout API call failed:', err)
			// Continue with local logout even if API call fails
		} finally {
			setUser(null)

			// Navigate to login page
			navigate('/login', { replace: true })
		}
	}

	// Context value
	const value: AuthContextType = {
		user,
		isAuthenticated,
		loading,
		login,
		signup,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext)

	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}

	return context
}
