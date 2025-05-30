import React from 'react'
import { Badge } from '../ui/badge'
import { IStatus } from '@/types/tasks'

export default function StatusBadge({ status }: { status: IStatus }) {
	return (
		<Badge
			className="text-black font-medium rounded-full gap-1 px-2"
			style={{
				color: status?.color,
				backgroundColor: `${status?.color}40`,
			}}
		>
			<div className="h-2 w-2 rounded-full" style={{ backgroundColor: status?.color }}></div>
			{status?.name}
		</Badge>
	)
}
