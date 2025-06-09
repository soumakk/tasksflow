import { Route, Routes } from 'react-router'
import Login from './routes/Login'
import Home from './routes/Home'
import Signup from './routes/Signup'
import AuthRoutes from './routes/AuthRoute'
import { PrivateRoute } from './routes/PrivateRoute'

function App() {
	return (
		<Routes>
			<Route element={<AuthRoutes />}>
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
			</Route>

			<Route element={<PrivateRoute />}>
				<Route path="/" element={<Home />} />
				<Route path="/:spaceId" element={<Home />} />
			</Route>
		</Routes>
	)
}

export default App
