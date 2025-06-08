import React, { useState } from 'react'

export default function TextareaField({
	onSave,
	initialValue,
}: {
	onSave: (value: string) => void
	initialValue: string
}) {
	const [text, setText] = useState(initialValue)
	return (
		<textarea
			className="text-sm w-full focus:outline-2 outline-primary p-3 bg-muted rounded-sm"
			defaultValue={initialValue}
			onBlur={() => onSave(text)}
			value={text}
			onChange={(e) => setText(e.target.value)}
			placeholder="Write task description here"
			rows={4}
		/>
	)
}
