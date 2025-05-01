import { Badge } from '@/components/ui/badge'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import TagBadge from '@/components/widgets/TagBadge'
import { db } from '@/lib/db'
import { generateId } from '@/lib/utils'
import { ITag } from '@/types/tasks'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export default function TagsField({
	onSave,
	initialTags,
	tagsList,
}: {
	onSave: (tagIds: string[]) => void
	initialTags: string[]
	tagsList: ITag[]
}) {
	const [selectedTagIds, setSelectedTagsIds] = useState<string[]>(initialTags ?? [])
	const [search, setSearch] = useState('')
	const [open, setOpen] = useState(false)

	useEffect(() => {
		if (initialTags) {
			setSelectedTagsIds(initialTags)
		}
	}, [initialTags])

	const filteredList = tagsList?.filter((opt) =>
		search ? opt.name?.toLowerCase().includes(search?.toLowerCase()) : true
	)

	async function handleSelect({ newTag, tagId }: { tagId?: string; newTag?: string }) {
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
		} else if (newTag && !tagId) {
			const newId = generateId()
			const temp = new Set(selectedTagIds)

			await db.tags.add({
				color: '#151515',
				name: newTag,
				created_at: dayjs().toISOString(),
				id: newId,
			})

			temp.add(newId)
			const tagIds = Array.from(temp)

			onSave(tagIds)
			setSearch('')
			// setOpen(false)
		}
	}

	const selectedTags = tagsList?.filter((tag) => selectedTagIds?.includes(tag.id))

	return (
		<Popover modal={true} open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button className="flex flex-wrap items-center gap-2 p-1 cursor-pointer data-[state=open]:outline-2 outline-primary">
					{selectedTagIds?.length ? (
						selectedTags?.map((tag) => <TagBadge tag={tag} />)
					) : (
						<p className="text-sm text-muted-foreground">Select tags</p>
					)}
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-48" align="start">
				<Command shouldFilter={false}>
					<CommandInput
						value={search}
						onValueChange={setSearch}
						placeholder={`Search tags`}
					/>

					<CommandList>
						<CommandEmpty>No tags found.</CommandEmpty>

						<CommandGroup>
							{filteredList?.length === 0 ? (
								<CommandItem
									onSelect={() => {
										handleSelect({ newTag: search })
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
											handleSelect({ tagId: opt.id })
										}}
										className="[&>svg]:size-4 text-xs p-2 justify-between"
									>
										<TagBadge tag={opt} />
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
