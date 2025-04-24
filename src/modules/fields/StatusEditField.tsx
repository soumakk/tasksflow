import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { StatusColors } from '@/lib/data'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils'
import { IStatus } from '@/types/tasks'
import { useForm } from '@tanstack/react-form'
import dayjs from 'dayjs'
import { atom } from 'jotai'
import { PlusIcon } from 'lucide-react'
import { isEmpty } from 'radash'
import { useState } from 'react'
import { CirclePicker } from 'react-color'

export default function StatusEditField({
	onSave,
	initialValue,
	statusList,
}: {
	onSave: (value: string) => void
	initialValue: string
	statusList: IStatus[]
}) {
	const [selected, setSelected] = useState(initialValue)
	const statusInfo = statusList?.find((opt) => opt.id === selected)

	return (
		<DropdownMenu modal={true}>
			<DropdownMenuTrigger asChild>
				<button className="w-full h-full flex items-center gap-2 px-3 cursor-pointer data-[state=open]:outline-2 outline-primary">
					{selected ? (
						<Badge
							className="text-black font-medium rounded-full gap-1 px-2"
							style={{
								color: statusInfo?.color,
								backgroundColor: `${statusInfo?.color}1a`,
							}}
						>
							<div
								className="h-2 w-2 rounded-full"
								style={{ backgroundColor: statusInfo?.color }}
							></div>
							{statusInfo?.name}
						</Badge>
					) : null}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto">
				{statusList?.map((opt) => (
					<DropdownMenuItem
						key={opt.id}
						onClick={() => {
							setSelected(opt.id)
							onSave(opt.id)
						}}
						className="[&>svg]:size-4 text-xs"
					>
						<div className="h-3 w-3 grid place-content-center">
							<div
								className="h-2 w-2 rounded-full"
								style={{
									backgroundColor: opt.color,
								}}
							></div>
						</div>

						<span>{opt.name}</span>
					</DropdownMenuItem>
				))}

				<AddStatusForm onSave={onSave} />
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function AddStatusForm({ onSave }: { onSave: (value: string) => void }) {
	const [isAddStatusOpen, setIsAddStatusOpen] = useState(false)
	const form = useForm({
		defaultValues: {
			name: '',
			color: '',
		},
		onSubmit: async ({ value }) => {
			if (value.name) {
				const newId = generateId()
				await db.status.add({
					color: isEmpty(value?.color) ? '#151515' : value?.color,
					name: value?.name,
					created_at: dayjs().toISOString(),
					updated_at: dayjs().toISOString(),
					id: newId,
				})
				await onSave(newId)
			}
		},
	})
	return (
		<Popover open={isAddStatusOpen} onOpenChange={setIsAddStatusOpen} modal={true}>
			<PopoverTrigger asChild>
				<DropdownMenuItem
					className="[&>svg]:size-3 text-xs"
					onClick={(e) => {
						e.preventDefault()
						setIsAddStatusOpen(true)
					}}
				>
					<PlusIcon />
					<span>Add status</span>
				</DropdownMenuItem>
			</PopoverTrigger>
			<PopoverContent className="p-0 w-[250px]" side="right" align="center">
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
