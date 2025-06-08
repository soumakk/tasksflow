import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { Loader } from 'lucide-react'

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-full gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-9 px-6 py-2',
				sm: 'h-8 px-3 text-xs',
				lg: 'h-10 px-8',
				icon: 'h-9 w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, loading, ...props }, ref) => {
		return (
			<button
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{loading ? <Loader className="h-4 w-4 animate-spin" /> : props.children}
			</button>
		)
	}
)
Button.displayName = 'Button'

const MotionButton = motion.create(Button)

export { Button, MotionButton, buttonVariants }
