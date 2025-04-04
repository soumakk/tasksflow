'use client'

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

export function MultiDropdown(props: {
	id?: string
	selected: string[]
	onSelect: (selected: string[]) => void
	options: ISelectOption[]
	title: string
	trigger?: React.ReactNode
}) {
	const { id, options, title, selected, trigger, onSelect } = props
	const [open, setOpen] = React.useState(false)

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
						'relative gap-1.5 font-normal rounded-full h-7 px-2.5 data-[state=open]:bg-muted',
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
			<PopoverContent className="w-[200px] p-0" align="start">
				<Command>
					<CommandInput placeholder={`Search ${title}`} />
					<CommandEmpty>No {title} found.</CommandEmpty>
					<CommandGroup>
						{options.map((opt) => (
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
								className="text-xs"
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
			</PopoverContent>
		</Popover>
	)
}
