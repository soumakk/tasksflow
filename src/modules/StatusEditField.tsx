import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { statusAtom } from '@/lib/atoms'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

export default function StatusEditField({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const statusList = useAtomValue(statusAtom)
	const [selected, setSelected] = useState(initialValue)
	const statusInfo = statusList?.find((opt) => opt.id === selected)

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button className="w-full h-full flex items-center gap-2 px-3">
					<Badge
						className="text-black font-medium rounded-full"
						style={{
							color: statusInfo?.color,
							backgroundColor: `${statusInfo?.color}1a`,
						}}
					>
						{statusInfo?.name}
					</Badge>
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
						<div
							className="h-2 w-2 rounded-full"
							style={{ backgroundColor: opt.color }}
						></div>
						<span>{opt.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
