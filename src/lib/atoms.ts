import { atomWithStorage } from 'jotai/utils'
import { defaultStatus, defaultTags, defaultTasks } from './data'
import { atom } from 'jotai'
import { RowSelectionState } from '@tanstack/react-table'

export const tasksAtom = atomWithStorage('tasks', defaultTasks)
export const statusAtom = atomWithStorage('status', defaultStatus)
export const tagsAtom = atomWithStorage('tags', defaultTags)

export const searchQueryAtom = atom('')
export const statusFilterAtom = atom<string[]>([])
export const tagsFilterAtom = atom<string[]>([])
export const priorityFilterAtom = atom<string[]>([])
export const selectedRowsAtom = atom<RowSelectionState>({})

export const titleAtom = atomWithStorage<string>('title', 'Tasks')
export const themeAtom = atomWithStorage<string>('theme', 'light')
