'use client'

import * as React from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ISelectOption } from '@/components/widgets/Select'
import { X } from 'lucide-react'
import { isEmpty } from 'radash'
import { Badge } from '../ui/badge'

export function MultiSelect(props: {
	id?: string
	value: string[]
	onChange: (selected: string[]) => void
	options: ISelectOption[]
	title: string
}) {
	const { id, options, title, value, onChange } = props
	const [open, setOpen] = React.useState(false)
	const [search, setSearch] = React.useState('')

	const filteredOptions = options?.filter((opt) =>
		isEmpty(search) ? true : opt.label?.toLowerCase()?.includes(search?.trim()?.toLowerCase())
	)

	function handleDelete(id: string) {
		const temp = new Set(value)
		if (temp.has(id)) {
			temp.delete(id)
		}
		onChange(Array.from(temp))
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div
					id={id}
					// variant="outline"
					// role="combobox"
					aria-expanded={open}
					className="flex w-full font-normal p-2 text-xs border border-border rounded-sm items-center gap-2"
				>
					{!isEmpty(value) ? (
						options
							.filter((opt) => value?.includes(opt.value))
							?.map((opt) => (
								<div>
									<Badge
										variant="outline"
										className="border-border px-2"
										onClick={(e) => e.stopPropagation()}
									>
										{opt.label}

										<button
											type="button"
											onClick={(e) => {
												e.stopPropagation()
												handleDelete(opt.value)
											}}
										>
											<X className="h-3 w-3 ml-1" />
										</button>
									</Badge>
								</div>
							))
					) : (
						<p className="">Select tags</p>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent className="p-0" align="start">
				<Command
					shouldFilter={false}
					// filter={(value, search, keywords) => {
					// 	if (value.includes(search)) return 1
					// 	return 0
					// }}
				>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder={`Search ${title}`}
					/>
					{/* <CommandEmpty>No {title} found.</CommandEmpty> */}
					<CommandGroup>
						{filteredOptions?.length === 0 ? (
							search ? (
								<CommandItem
									// key={opt.value}
									// value={opt.value}
									onSelect={(currentValue) => {
										const temp = new Set(value)
										if (temp.has(currentValue)) {
											temp.delete(currentValue)
										} else {
											temp.add(currentValue)
										}
										onChange(Array.from(temp))
									}}
								>
									{/* <Checkbox checked={value?.includes(opt.value)} className="mr-2" /> */}
									Create new {search}
								</CommandItem>
							) : (
								<div className="text-xs py-8 grid place-content-center">
									No {title} found.
								</div>
							)
						) : (
							filteredOptions?.map((opt) => (
								<CommandItem
									key={opt.value}
									value={opt.value}
									onSelect={(currentValue) => {
										const temp = new Set(value)
										if (temp.has(currentValue)) {
											temp.delete(currentValue)
										} else {
											temp.add(currentValue)
										}
										onChange(Array.from(temp))
									}}
								>
									<Checkbox
										checked={value?.includes(opt.value)}
										className="mr-2"
									/>
									{opt.label}
								</CommandItem>
							))
						)}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
