import React, { useState } from 'react'

export default function TextField({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const [text, setText] = useState(initialValue)
	return (
		<input
			className="text-2xl font-medium w-full focus:outline-2 outline-primary p-2"
			defaultValue={initialValue}
			onBlur={() => onSave(text)}
			value={text}
			onChange={(e) => setText(e.target.value)}
			placeholder="Untitled"
		/>
	)
}
