import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: string, format?: string) {
	return dayjs(new Date(date)).format(format ?? 'MMM DD, YYYY')
}

export const generateId = (size: number = 10): string => {
	const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', size)
	return nanoid()
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
	let timeoutId: ReturnType<typeof setTimeout> | null = null
	return function (...args: Parameters<T>) {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		timeoutId = setTimeout(() => {
			func(...args)
		}, delay)
	}
}
