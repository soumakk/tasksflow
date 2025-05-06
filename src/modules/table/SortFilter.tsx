import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { sortFilterAtom } from '@/lib/atoms'
import { SortBy } from '@/lib/hooks/useFilteredTasks'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import {
	ArrowDownAZ,
	ArrowUpDown,
	ArrowUpZA,
	CalendarArrowDown,
	CalendarArrowUp,
} from 'lucide-react'

const sortOptions = [
	{ label: 'Title (A → Z)', value: SortBy.TitleAsc, Icon: ArrowDownAZ },
	{ label: 'Title (Z → A)', value: SortBy.TitleDesc, Icon: ArrowUpZA },
	{ label: 'Last updated (Oldest First)', value: SortBy.DateAsc, Icon: CalendarArrowDown },
	{ label: 'Last updated (Newest First)', value: SortBy.DateDesc, Icon: CalendarArrowUp },
]

export default function SortFilter() {
	const [sortFilter, setSortFilter] = useAtom(sortFilterAtom)
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					className={cn(
						'h-8 px-3 rounded-full text-xs font-medium gap-1 border border-border text-muted-foreground flex items-center justify-center hover:bg-muted hover:text-primary',
						{ 'text-primary': !!sortFilter }
					)}
				>
					<ArrowUpDown className="h-4 w-4" />
					<span>Sort</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto" align="center">
				{sortOptions?.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
						onClick={() => {
							setSortFilter(opt.value)
						}}
						className={cn('[&>svg]:size-4 text-xs', {
							'bg-primary/10 text-primary': sortFilter === opt.value,
						})}
					>
						<opt.Icon
							className={cn('h-4 w-4 text-muted-foreground', {
								'text-primary': sortFilter === opt.value,
							})}
						/>
						<span>{opt.label}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
