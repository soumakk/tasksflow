import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
	startIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, startIcon, ...props }, ref) => {
		return (
			<div className="flex items-center h-8 w-full rounded-full border border-input bg-transparent px-2 py-1 text-base focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-xs">
				{startIcon && <span className="mr-2 text-foreground">{startIcon}</span>}
				<input
					type={type}
					className={cn(
						'w-full bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
						className
					)}
					ref={ref}
					{...props}
				/>
			</div>
		)
	}
)

Input.displayName = 'Input'

export { Input }
