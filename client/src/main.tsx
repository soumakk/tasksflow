import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { QueryProvider } from './context/QueryProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryProvider>
				<AuthProvider>
					<App />
				</AuthProvider>
			</QueryProvider>
		</BrowserRouter>
	</StrictMode>
)
