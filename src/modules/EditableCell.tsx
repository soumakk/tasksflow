import React, { useState } from 'react'

export default function EditableCell({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const [text, setText] = useState(initialValue)
	return (
		<input
			className="h-full w-full px-3 ring ring-primary outline-none"
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
