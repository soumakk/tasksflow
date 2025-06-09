import { useAuth } from '@/context/AuthContext'
import { Loader } from 'lucide-react'
import { Navigate, Outlet } from 'react-router'

export default function AuthRoutes() {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className="h-dvh w-full grid place-content-center">
				<Loader className="h-5 w-5 animate-spin" />
			</div>
		)
	}

	return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
