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

export default function PriorityField({
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
				<button className="flex w-full items-center hover:bg-muted rounded-sm text-xs gap-2 h-8 px-2 cursor-pointer data-[state=open]:outline-2 outline-primary">
					{selected ? (
						<>
							<PriorityFlag priority={selected as TaskPriority} className="h-4 w-4" />
							<span>{selectedLabel}</span>
						</>
					) : null}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-auto" align="start">
				{PriorityOptions?.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
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
