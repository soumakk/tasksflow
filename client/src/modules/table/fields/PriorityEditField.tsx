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
				<button
					onClick={(e) => e.stopPropagation()}
					className="w-full h-full flex items-center gap-2 px-3 cursor-pointer data-[state=open]:outline-2 outline-primary"
				>
					{selected ? (
						<>
							<PriorityFlag priority={selected as TaskPriority} />
							<span>{selectedLabel}</span>
						</>
					) : null}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40">
				{PriorityOptions?.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
						onClick={(e) => {
							setSelected(opt.value)
							onSave(opt.value)
							e.stopPropagation()
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
