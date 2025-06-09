import { Navigate, Outlet } from 'react-router'
import { Loader } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export const PrivateRoute = () => {
	const { isAuthenticated, loading } = useAuth()

	if (loading) {
		return (
			<div className="h-dvh w-full grid place-content-center">
				<Loader className="h-5 w-5 animate-spin" />
			</div>
		)
	}

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
