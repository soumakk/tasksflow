import { zValidator } from '@hono/zod-validator'
import { ZodError, ZodSchema } from 'zod'

function formatZodError(error: ZodError) {
	return error.issues.map((issue) => ({
		path: issue.path.join('.'),
		message: issue.message,
	}))
}

export function validate(schema: ZodSchema) {
	return zValidator('json', schema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					error: 'Validation failed',
					details: formatZodError(result.error),
				},
				400
			)
		}
	})
}
