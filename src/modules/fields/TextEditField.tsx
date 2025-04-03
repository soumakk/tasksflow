import React, { useState } from 'react'

export default function TextEditField({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const [text, setText] = useState(initialValue)
	return (
		<input
			className="h-full w-full px-3 focus:outline-2 outline-primary"
			defaultValue={initialValue}
			onBlur={() => onSave(text)}
			value={text}
			onChange={(e) => setText(e.target.value)}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					onSave(text)
				}
			}}
			autoFocus
		/>
	)
}
