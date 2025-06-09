import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const client = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

export const QueryProvider = ({ children }: { children: ReactNode }) => {
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
