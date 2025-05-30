import { ITag } from '@/types/tasks'
import { Badge } from '../ui/badge'

export default function TagBadge({ tag }: { tag: ITag }) {
	return (
		<Badge
			className="text-black font-medium rounded-sm gap-1 px-2"
			style={{
				color: tag?.color,
				backgroundColor: `${tag?.color}40`,
			}}
		>
			{tag?.name}
		</Badge>
	)
}
