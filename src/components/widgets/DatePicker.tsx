'use client'

import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'

interface IDatePicker {
	id: string
	value: string
	onChange: (date?: string) => void
	onBlur?: () => void
}

export function DatePicker({ value, onChange, ...rest }: IDatePicker) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'h-8 w-full justify-start text-left text-xs font-normal px-2',
						!value && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className="h-4 w-4" />
					{value ? dayjs(value).format('MMM DD, YYYY') : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={dayjs(value).toDate()}
					onSelect={(date) => onChange(dayjs(date).toISOString())}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
