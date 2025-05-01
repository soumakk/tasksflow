import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import StatusBadge from '@/components/widgets/StatusBadge'
import { StatusColors } from '@/lib/data'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils'
import { IStatus } from '@/types/tasks'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CirclePicker } from 'react-color'

export default function StatusField({
	onSave,
	initialValue,
	statusList,
}: {
	onSave: (value: string) => void
	initialValue: string
	statusList: IStatus[]
}) {
	const [currentStatus, setCurrentStatus] = useState(initialValue)
	const [search, setSearch] = useState('')
	const statusInfo = statusList?.find((opt) => opt.id === currentStatus)
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (initialValue) {
			setCurrentStatus(initialValue)
		}
	}, [initialValue])

	const filteredList = statusList?.filter((opt) =>
		search ? opt.name?.toLowerCase().includes(search?.toLowerCase()) : true
	)

	async function handleSelect({
		newStatus,
		statusId,
	}: {
		statusId?: string
		newStatus?: string
	}) {
		if (statusId) {
			setCurrentStatus(statusId)
			onSave(statusId)
			setOpen(false)
		} else if (newStatus && !statusId) {
			const newId = generateId()
			await db.status.add({
				color: '#151515',
				name: newStatus,
				created_at: dayjs().toISOString(),
				updated_at: dayjs().toISOString(),
				id: newId,
			})
			await onSave(newId)
			setSearch('')
			setOpen(false)
		}
	}

	return (
		<Popover modal={true} open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button className="flex items-center gap-2 p-1 cursor-pointer data-[state=open]:outline-2 outline-primary">
					{currentStatus ? <StatusBadge status={statusInfo} /> : null}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-48" align="start">
				<Command shouldFilter={false}>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder={`Search status`}
					/>

					<CommandList>
						<CommandEmpty>No status found.</CommandEmpty>

						<CommandGroup>
							{filteredList?.length === 0 ? (
								<CommandItem
									onSelect={() => {
										handleSelect({ newStatus: search })
									}}
								>
									Create{' '}
									<Badge className="text-black bg-zinc-300 hover:bg-zinc-300 font-medium rounded-full gap-1 px-2 text-ellipsis overflow-hidden">
										<p className="text-ellipsis overflow-hidden whitespace-nowrap">
											{search}
										</p>
									</Badge>
								</CommandItem>
							) : (
								filteredList?.map((opt) => (
									<CommandItem
										key={opt.id}
										onSelect={() => {
											handleSelect({ statusId: opt.id })
										}}
										className="[&>svg]:size-4 text-xs p-2 justify-between"
									>
										<StatusBadge status={opt} />
										{/* <EditStatus onSave={onSave} selected={opt} /> */}
									</CommandItem>
								))
							)}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

function EditStatus({ onSave, selected }: { selected: IStatus; onSave: (value: string) => void }) {
	const [open, setOpen] = useState(false)
	const form = useForm({
		defaultValues: {
			name: selected?.name ?? '',
			color: selected?.color ?? '',
		},
		onSubmit: async ({ value }) => {
			// if (value.name) {
			// 	const newId = generateId()
			// 	await db.status.add({
			// 		color: isEmpty(value?.color) ? '#151515' : value?.color,
			// 		name: value?.name,
			// 		created_at: dayjs().toISOString(),
			// 		updated_at: dayjs().toISOString(),
			// 		id: newId,
			// 	})
			// 	await onSave(newId)
			// }
		},
	})
	return (
		<Popover open={open} onOpenChange={setOpen} modal={true}>
			<PopoverTrigger asChild>
				<button
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
						setOpen(true)
					}}
				>
					<Pencil className="h-4 w-4 text-muted-foreground" />
				</button>
			</PopoverTrigger>
			<PopoverContent className="" side="bottom" align="center">
				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
					className="flex-1 flex flex-col overflow-hidden"
				>
					<div className="space-y-4  p-4 flex-1 overflow-auto">
						<form.Field name="name">
							{(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name}>Name</Label>
									<Input
										autoFocus
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
									/>
								</div>
							)}
						</form.Field>

						<form.Field name="color">
							{(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name}>Color</Label>

									<CirclePicker
										colors={StatusColors}
										color={field.state.value}
										onChangeComplete={(color) => field.handleChange(color.hex)}
										circleSize={20}
										circleSpacing={4}
										width="100%"
									/>
								</div>
							)}
						</form.Field>
					</div>

					<div className="flex items-center gap-2 px-4 pb-4">
						<Button size="sm" className="w-full">
							Save
						</Button>
					</div>
				</form>
			</PopoverContent>
		</Popover>
	)
}
