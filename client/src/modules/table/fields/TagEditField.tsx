import { Badge } from '@/components/ui/badge'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import TagBadge from '@/components/widgets/TagBadge'
import { IStatus, ITag } from '@/types/tasks'
import { Tag } from 'lucide-react'
import { useState } from 'react'

export default function TagEditField({
	onSave,
	initialValue,
	tagsList,
}: {
	onSave: (tagIds: string[]) => void
	initialValue: string[]
	tagsList: ITag[]
}) {
	const [isAddStatusOpen, setIsAddStatusOpen] = useState(false)
	const [selectedTagIds, setSelectedTagsIds] = useState<string[]>(initialValue ?? [])

	async function handleSelect({
		label,
		tagId,
		color,
	}: {
		tagId?: string
		label?: string
		color?: string
	}) {
		if (tagId) {
			const temp = new Set(selectedTagIds)
			if (temp.has(tagId)) {
				temp.delete(tagId)
			} else {
				temp.add(tagId)
			}
			const tagIds = Array.from(temp)

			setSelectedTagsIds(tagIds)
			onSave(tagIds)
			// setOpen(false)
		}
	}

	const selectedTags = tagsList?.filter((tag) => selectedTagIds?.includes(tag.id))

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					onClick={(e) => e.stopPropagation()}
					className="w-full h-full flex items-center gap-2 px-3 cursor-pointer data-[state=open]:outline-2 outline-primary"
				>
					{selectedTagIds?.length
						? selectedTags?.map((tag) => <TagBadge tag={tag} />)
						: null}
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40 max-h-60">
				{tagsList?.map((opt) => (
					<DropdownMenuItem
						key={opt.id}
						onClick={(e) => {
							handleSelect({ tagId: opt.id })
							e.stopPropagation()
						}}
						className="[&>svg]:size-4 text-xs p-1"
					>
						<TagBadge tag={opt} />
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
