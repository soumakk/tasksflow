import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { IStatus } from '@/types/tasks'
import { useState } from 'react'

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
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					onClick={(e) => e.stopPropagation()}
					className="w-full h-full flex items-center gap-2 px-3 cursor-pointer data-[state=open]:outline-2 outline-primary"
				>
					{selected ? (
						<Badge
							className="text-black font-medium rounded-full"
							style={{
								color: statusInfo?.color,
								backgroundColor: `${statusInfo?.color}1a`,
							}}
						>
							{statusInfo?.name}
						</Badge>
					) : null}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40">
				{statusList?.map((opt) => (
					<DropdownMenuItem
						key={opt.id}
						onClick={(e) => {
							setSelected(opt.id)
							onSave(opt.id)
							e.stopPropagation()
						}}
						className="[&>svg]:size-4 text-xs"
					>
						<div
							className="h-3 w-3 rounded-full border-2 border-background"
							style={{ backgroundColor: opt.color }}
						></div>
						<span>{opt.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

// function AddStatusForm({ onClose }: { onClose: () => void }) {
// 	const form = useForm({
// 		defaultValues: {
// 			name: '',
// 			color: '',
// 		},
// 		onSubmit: async ({ value }) => {
// 			console.log(value)
// 			await db.status.add({
// 				color: value?.color,
// 				name: value?.name,
// 				created_at: dayjs().toISOString(),
// 				updated_at: dayjs().toISOString(),
// 				id: generateId(),
// 			})
// 			// onClose()
// 		},
// 	})
// 	return (
// 		<form
// 			onSubmit={(e) => {
// 				e.preventDefault()
// 				e.stopPropagation()
// 				void form.handleSubmit()
// 			}}
// 			className="flex-1 flex flex-col overflow-hidden"
// 		>
// 			<div className="space-y-4  p-4 flex-1 overflow-auto">
// 				<form.Field name="name">
// 					{(field) => (
// 						<div className="flex flex-col gap-2">
// 							<Label htmlFor={field.name}>Name</Label>
// 							<Input
// 								autoFocus
// 								id={field.name}
// 								name={field.name}
// 								value={field.state.value}
// 								onBlur={field.handleBlur}
// 								onChange={(e) => field.handleChange(e.target.value)}
// 							/>
// 						</div>
// 					)}
// 				</form.Field>

// 				<form.Field name="color">
// 					{(field) => (
// 						<div className="flex flex-col gap-2">
// 							<Label htmlFor={field.name}>Color</Label>

// 							<CirclePicker
// 								colors={StatusColors}
// 								color={field.state.value}
// 								onChangeComplete={(color) => field.handleChange(color.hex)}
// 								circleSize={20}
// 								circleSpacing={4}
// 								width="100%"
// 							/>
// 						</div>
// 					)}
// 				</form.Field>
// 			</div>

// 			<div className="flex items-center gap-2 px-4 pb-4">
// 				<Button size="sm" className="w-full">
// 					Save
// 				</Button>
// 			</div>
// 		</form>
// 	)
// }
