import { titleAtom } from '@/lib/atoms'
import { db } from '@/lib/db'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'

const defaultTitle = 'Tasks'

export default function Title() {
	// const [title, setTitle] = useState(defaultTitle)
	const [title, setTitle] = useAtom(titleAtom)

	// async function getTitle() {
	// 	const data = await db.settings.get('title')
	// 	setTitle(data?.value ?? defaultTitle)
	// }

	// async function updateTitle() {
	// 	await db.settings.put({ key: 'title', value: title })
	// }

	// useEffect(() => {
	// 	getTitle()
	// }, [])

	return (
		<>
			{/* <h1 className="font-semibold text-2xl">Tasks</h1> */}
			<input
				type="text"
				defaultValue="Tasks"
				className="font-medium text-2xl outline-none"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				// onBlur={updateTitle}
			/>
		</>
	)
}
