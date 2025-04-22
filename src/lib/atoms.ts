import { RowSelectionState } from '@tanstack/react-table'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const searchQueryAtom = atom('')
export const statusFilterAtom = atom<string[]>([])
export const tagsFilterAtom = atom<string[]>([])
export const priorityFilterAtom = atom<string[]>([])
export const selectedRowsAtom = atom<RowSelectionState>({})

export const titleAtom = atomWithStorage<string>('title', 'Tasks')
export const themeAtom = atomWithStorage<string>('theme', 'light')
export const currentTabAtom = atomWithStorage<string>('tab', 'table')

export const boardColumnsAtom = atomWithStorage<Record<string, string[]>>('board-columns', {})
