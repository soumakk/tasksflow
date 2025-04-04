import { Button } from '@/components/ui/button'
import { themeAtom } from '@/lib/atoms'
import { useAtom } from 'jotai'
import { Moon, Sun } from 'lucide-react'
import React, { useLayoutEffect } from 'react'

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
		<button
			onClick={toggleTheme}
			className="border border-border h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted"
		>
			{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</button>
	)
}
