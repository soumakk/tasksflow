import { Route, Routes } from 'react-router'
import Login from './routes/Login'
import Home from './routes/Home'
import Signup from './routes/Signup'

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/signup" element={<Signup />} />

			<Route path="/" element={<Home />} />
		</Routes>
	)
}

export default App
