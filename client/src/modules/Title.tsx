import { titleAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'

export default function Title() {
	const [title, setTitle] = useAtom(titleAtom)

	return (
		<>
			<input
				type="text"
				defaultValue="Tasks"
				className="font-medium text-2xl outline-none flex-1 w-full"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
		</>
	)
}
