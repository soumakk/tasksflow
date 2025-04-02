import { cn } from '@/lib/utils'
import { TaskPriority } from '@/types/tasks'
import { Flag } from 'lucide-react'

export default function PriorityFlag({ priority }: { priority: TaskPriority }) {
	return (
		<Flag
			className={cn('h-3 w-3', {
				'stroke-red-500': priority === TaskPriority.Urgent,
				'stroke-yellow-500': priority === TaskPriority.High,
				'stroke-blue-500': priority === TaskPriority.Normal,
				'stroke-gray-500': priority === TaskPriority.Low,
			})}
		/>
	)
}
