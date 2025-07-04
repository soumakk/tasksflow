import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate } from '@/lib/utils'
import dayjs from 'dayjs'

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
				<button className="h-8 px-2 gap-2 hover:bg-muted rounded-sm text-xs flex items-center cursor-pointer data-[state=open]:outline-2 outline-primary">
					{initialValue ? (
						<p className="whitespace-nowrap">
							{formatDate(initialValue, 'MMMM DD, YYYY  HH:MM A')}
						</p>
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
