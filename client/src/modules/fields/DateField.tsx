import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate } from '@/lib/utils'
import dayjs from 'dayjs'
import { Calendar1 } from 'lucide-react'

export default function DateField({
	initialValue,
	onSave,
}: {
	initialValue: string
	onSave: (value: string) => void
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="h-8 px-2 w-full gap-2 bg-muted rounded-sm border border-border text-xs flex items-center cursor-pointer data-[state=open]:outline-2 outline-primary">
					<Calendar1 className="h-4 w-4 text-muted-foreground" />
					{initialValue ? (
						<p className="whitespace-nowrap">{formatDate(initialValue)}</p>
					) : (
						<p className="text-sm">Pick a date</p>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={dayjs(initialValue).toDate()}
					onSelect={(date) => onSave(dayjs(date).toISOString())}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	)
}
