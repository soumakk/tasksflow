import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { SignupForm } from '@/modules/auth/SignupForm'

export default function Signup() {
	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className={cn('flex flex-col gap-6')}>
					<Card>
						<CardHeader className="text-center">
							<CardTitle className="text-xl">Create account</CardTitle>
							<CardDescription>Login with your email and password</CardDescription>
						</CardHeader>
						<CardContent>
							<SignupForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
