import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import PriorityFlag from '@/components/widgets/Flag'
import { PriorityOptions } from '@/lib/data'
import { TaskPriority } from '@/types/tasks'
import { useState } from 'react'

export default function PriorityEditField({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const [selected, setSelected] = useState(initialValue)
	const selectedLabel = PriorityOptions?.find((opt) => opt.value === selected)?.label
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button className="w-full h-full flex items-center gap-2 px-3">
					<PriorityFlag priority={selected as TaskPriority} />
					<span>{selectedLabel}</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto">
				{PriorityOptions?.map((opt) => (
					<DropdownMenuItem
						onClick={() => {
							setSelected(opt.value)
							onSave(opt.value)
						}}
						className="[&>svg]:size-4 text-xs"
					>
						<PriorityFlag priority={opt.value} />
						<span>{opt.label}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
