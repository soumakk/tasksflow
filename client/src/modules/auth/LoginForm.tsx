import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/lib/error'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

export default function LoginForm() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		onSubmit: async ({ value }) => {
			try {
				setIsLoading(true)
				await login({ email: value.email, password: value.password })
				navigate('/', { replace: true })
			} catch (error) {
				toast.error(getErrorMessage(error))
			} finally {
				setIsLoading(false)
			}
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.stopPropagation()
				e.preventDefault()
				form.handleSubmit()
			}}
		>
			<div className="grid gap-6">
				<div className="grid gap-6">
					<div className="grid gap-2">
						<form.Field name="email">
							{(field) => {
								return (
									<>
										<Label htmlFor={field.name}>Email</Label>
										<Input
											type="email"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</>
								)
							}}
						</form.Field>
					</div>
					<div className="grid gap-2">
						<form.Field name="password">
							{(field) => {
								return (
									<>
										<div className="flex items-center">
											<Label htmlFor="password">Password</Label>
											<a
												href="#"
												className="ml-auto text-sm underline-offset-4 hover:underline"
											>
												Forgot your password?
											</a>
										</div>
										<Input
											type="password"
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
									</>
								)
							}}
						</form.Field>
					</div>
					<Button loading={isLoading} size="lg" type="submit" className="w-full">
						Login
					</Button>
				</div>
				<div className="text-center text-sm">
					Don&apos;t have an account?{' '}
					<Link to="/signup" className="underline underline-offset-4">
						Sign up
					</Link>
				</div>
			</div>
		</form>
	)
}
