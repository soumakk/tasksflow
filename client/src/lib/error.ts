export function getErrorMessage(error: unknown): string {
	// Handle Error objects
	if (error instanceof Error) {
		return error.message
	}

	// Handle string errors
	if (typeof error === 'string') {
		return error
	}

	// Handle API error responses (e.g., { error: 'msg' } or { message: 'msg' })
	if (typeof error === 'object' && error !== null) {
		if ('error' in error && typeof (error as any).error === 'string') {
			return (error as any).error
		}
		if ('message' in error && typeof (error as any).message === 'string') {
			return (error as any).message
		}
		// Handle Zod validation errors (array of issues)
		if ('issues' in error && Array.isArray((error as any).issues)) {
			return (error as any).issues.map((issue: any) => issue.message).join(', ')
		}
	}

	// Fallback message
	return 'An unexpected error occurred. Please try again.'
}
