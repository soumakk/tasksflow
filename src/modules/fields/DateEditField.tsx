import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { formatDate } from '@/lib/utils'
import dayjs from 'dayjs'

export default function DateEditField({
	initialValue,
	onSave,
}: {
	initialValue: string
	onSave: (value: string) => void
}) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="h-full w-full px-3 flex items-center cursor-pointer data-[state=open]:outline-2 outline-primary">
					{initialValue ? (
						<p className="whitespace-nowrap">{formatDate(initialValue)}</p>
					) : null}
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
