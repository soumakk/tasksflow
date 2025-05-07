import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ISelectOption } from '@/components/widgets/Select'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export function MultiDropdown(props: {
	id?: string
	selected: string[]
	onSelect: (selected: string[]) => void
	options: ISelectOption[]
	title: string
	trigger?: React.ReactNode
	hideSearch?: boolean
}) {
	const { id, options, title, selected, trigger, onSelect, hideSearch } = props
	const [open, setOpen] = React.useState(false)
	const [search, setSearch] = React.useState('')

	const filteredOptions = options?.filter((opt) =>
		search ? opt.label?.toLowerCase().includes(search?.toLowerCase()) : true
	)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					id={id}
					variant="ghost"
					size="sm"
					role="combobox"
					aria-expanded={open}
					className={cn(
						'relative gap-1.5 font-normal rounded-full border border-border h-8 px-3 data-[state=open]:bg-muted',
						{
							'bg-primary/10': selected?.length,
						}
					)}
				>
					{trigger ?? <span className="capitalize">{title}</span>}
					{selected?.length ? (
						<Badge className="ml-1 text-xs h-4 w-4 p-0 grid place-content-center rounded-full">
							{selected?.length}
						</Badge>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px]" align="start">
				<Command shouldFilter={false}>
					{!hideSearch && (
						<CommandInput
							value={search}
							onValueChange={setSearch}
							placeholder={`Search ${title}`}
						/>
					)}
					<CommandEmpty>No {title} found.</CommandEmpty>
					<CommandGroup className="max-h-[200px] overflow-auto">
						{filteredOptions.map((opt) => (
							<CommandItem
								key={opt.value}
								value={opt.value}
								onSelect={(currentValue) => {
									const temp = new Set(selected)
									if (temp.has(currentValue)) {
										temp.delete(currentValue)
									} else {
										temp.add(currentValue)
									}
									onSelect(Array.from(temp))
								}}
								className="text-xs p-2"
							>
								<Checkbox
									checked={selected?.includes(opt.value)}
									className="mr-1"
								/>
								{opt.label}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>

				{selected?.length ? (
					<Button
						variant="secondary"
						size="sm"
						className="w-full "
						onClick={() => {
							onSelect([])
						}}
					>
						Clear
					</Button>
				) : null}
			</PopoverContent>
		</Popover>
	)
}
