import Select from '@/components/widgets/Select'
import { PriorityOptions } from '@/lib/data'
import React, { useState } from 'react'

export default function PriorityEditField({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const [text, setText] = useState(initialValue)
	return (
		<Select
			options={PriorityOptions}
			id="priority"
			// className="h-full w-full px-3 ring ring-primary outline-none"
			// defaultValue={initialValue}
			// onBlur={() => onSave(text)}
			value={text}
			onChange={(e) => setText(e)}
			// onKeyDown={(e) => {
			// 	if (e.key === 'Enter') {
			// 		onSave(text)
			// 	}
			// }}
			// autoFocus
		/>
	)
}
