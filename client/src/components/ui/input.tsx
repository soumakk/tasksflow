import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
	startIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, startIcon, ...props }, ref) => {
		return (
			<div
				className={cn(
					'flex items-center h-10 w-full rounded-md border border-input bg-transparent px-4 py-1 text-base focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-xs',
					className
				)}
			>
				{startIcon && <span className="mr-2 text-foreground">{startIcon}</span>}
				<input
					type={type}
					className={
						'w-full h-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
					}
					ref={ref}
					{...props}
				/>
			</div>
		)
	}
)

Input.displayName = 'Input'

export { Input }
