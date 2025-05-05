import { themeAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useLayoutEffect } from 'react'

export default function ThemeSwitch() {
	const [theme, setTheme] = useAtom(themeAtom)

	function toggleTheme() {
		setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
	}

	useLayoutEffect(() => {
		const root = window.document.documentElement
		root.classList.remove('light', 'dark')

		root.classList.add(theme)
	}, [theme])

	return (
		<motion.button
			whileTap={{ scale: 0.98 }}
			whileHover={{ scale: 1.05 }}
			onClick={toggleTheme}
			className="border border-border h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted shrink-0"
		>
			{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</motion.button>
	)
}
