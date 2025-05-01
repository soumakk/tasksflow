import { IStatus, ITag, ITask, TaskPriority } from '../types/tasks'

export const PriorityOptions = [
	{
		label: 'Urgent',
		value: TaskPriority.Urgent,
	},
	{
		label: 'High',
		value: TaskPriority.High,
	},
	{
		label: 'Normal',
		value: TaskPriority.Normal,
	},
	{
		label: 'Low',
		value: TaskPriority.Low,
	},
]

export const defaultStatus: IStatus[] = [
	{
		id: 's-1',
		name: 'To Do',
		color: '#FFB800', // Amber
		created_at: '2025-01-01T00:00:00Z',
		updated_at: '2025-01-01T00:00:00Z',
	},
	{
		id: 's-2',
		name: 'In Progress',
		color: '#2979FF', // Blue
		created_at: '2025-01-01T00:00:00Z',
		updated_at: '2025-01-01T00:00:00Z',
	},
	{
		id: 's-3',
		name: 'Completed',
		color: '#00C853', // Green
		created_at: '2025-01-01T00:00:00Z',
		updated_at: '2025-01-01T00:00:00Z',
	},
]

export const defaultTags: ITag[] = [
	{
		id: 't-1',
		name: 'Bug',
		color: '#D32F2F', // Red
		created_at: '2025-01-02T00:00:00Z',
	},
	{
		id: 't-2',
		name: 'Design',
		color: '#F06292', // Pink
		created_at: '2025-01-02T00:00:00Z',
	},
	{
		id: 't-3',
		name: 'Meeting',
		color: '#BA68C8', // Purple
		created_at: '2025-01-02T00:00:00Z',
	},
	{
		id: 't-4',
		name: 'Research',
		color: '#4DB6AC', // Teal
		created_at: '2025-01-02T00:00:00Z',
	},
	{
		id: 't-5',
		name: 'DevOps',
		color: '#FFD54F', // Yellow
		created_at: '2025-01-02T00:00:00Z',
	},
	{
		id: 't-6',
		name: 'Refactor',
		color: '#90A4AE', // Blue Grey
		created_at: '2025-01-02T00:00:00Z',
	},
	{
		id: 't-7',
		name: 'Feature',
		color: '#4CAF50', // Green
		created_at: '2025-01-02T00:00:00Z',
	},
]

export const defaultTasks: ITask[] = [
	{
		id: '1',
		created_at: '2025-03-08T10:05:00Z',
		title: 'Fix login issue',
		description: 'Users cannot log in on mobile',
		priority: 'high',
		due_date: '2025-03-10T00:00:00Z',
		status_id: 's-1',
		updated_at: '2025-03-08T10:05:00Z',
		tag_ids: ['t-1'],
		sub_tasks: [
			{ id: 'st-1', title: 'Debug mobile auth', completed: false },
			{ id: 'st-2', title: 'Test on iOS & Android', completed: false },
		],
	},
	{
		id: '2',
		created_at: '2025-03-05T09:00:00Z',
		title: 'Design onboarding flow',
		description: 'Create wireframes for new user onboarding',
		priority: 'normal',
		due_date: '2025-03-12T00:00:00Z',
		status_id: 's-2',
		updated_at: '2025-03-06T11:30:00Z',
		tag_ids: ['t-2', 't-3'],
		sub_tasks: [
			{ id: 'st-3', title: 'Sketch flow', completed: true },
			{ id: 'st-4', title: 'Create Figma mockups', completed: false },
		],
	},
	{
		id: '3',
		created_at: '2025-03-01T14:00:00Z',
		title: 'Update landing page',
		description: null,
		priority: 'low',
		due_date: '2025-03-20T00:00:00Z',
		status_id: 's-3',
		updated_at: '2025-03-01T14:00:00Z',
		tag_ids: [],
		sub_tasks: [],
	},
	{
		id: '4',
		created_at: '2025-03-09T08:00:00Z',
		title: 'Research competitor apps',
		description: 'Gather insights from top 5 competitors',
		priority: 'normal',
		due_date: '2025-03-15T00:00:00Z',
		status_id: 's-1',
		updated_at: '2025-03-09T08:00:00Z',
		tag_ids: ['t-4'],
		sub_tasks: [{ id: 'st-5', title: 'List features of each app', completed: false }],
	},
	{
		id: '5',
		created_at: '2025-03-07T13:00:00Z',
		title: 'Deploy staging server',
		description: 'Set up new staging environment on AWS',
		priority: 'urgent',
		due_date: '2025-03-08T00:00:00Z',
		status_id: 's-2',
		updated_at: '2025-03-07T14:00:00Z',
		tag_ids: ['t-5'],
		sub_tasks: [
			{ id: 'st-6', title: 'Provision EC2 instance', completed: true },
			{ id: 'st-7', title: 'Deploy backend services', completed: false },
		],
	},
	{
		id: '6',
		created_at: '2025-03-02T10:00:00Z',
		title: 'Write unit tests',
		description: 'Improve test coverage for user module',
		priority: 'high',
		due_date: '2025-03-11T00:00:00Z',
		status_id: 's-3',
		updated_at: '2025-03-04T09:00:00Z',
		tag_ids: ['t-1', 't-6'],
		sub_tasks: [],
	},
	{
		id: '7',
		created_at: '2025-03-06T15:00:00Z',
		title: 'Team meeting prep',
		description: 'Prepare agenda and slides',
		priority: 'normal',
		due_date: '2025-03-07T00:00:00Z',
		status_id: 's-2',
		updated_at: '2025-03-06T16:00:00Z',
		tag_ids: ['t-3'],
		sub_tasks: [
			{ id: 'st-8', title: 'Draft agenda', completed: true },
			{ id: 'st-9', title: 'Make slide deck', completed: false },
		],
	},
	{
		id: '8',
		created_at: '2025-03-10T11:00:00Z',
		title: 'Optimize images',
		description: 'Compress and lazy-load homepage images',
		priority: 'low',
		due_date: '2025-03-22T00:00:00Z',
		status_id: 's-1',
		updated_at: '2025-03-10T11:00:00Z',
		tag_ids: [],
		sub_tasks: [],
	},
	{
		id: '9',
		created_at: '2025-03-11T09:00:00Z',
		title: 'Add forgot password feature',
		description: 'Implement password recovery flow',
		priority: 'high',
		due_date: '2025-03-14T00:00:00Z',
		status_id: 's-2',
		updated_at: '2025-03-11T10:00:00Z',
		tag_ids: ['t-1', 't-7'],
		sub_tasks: [
			{ id: 'st-10', title: 'Create API endpoint', completed: false },
			{ id: 'st-11', title: 'Build frontend modal', completed: false },
		],
	},
	{
		id: '10',
		created_at: '2025-03-04T07:30:00Z',
		title: 'Refactor settings page',
		description: 'Simplify layout and clean up unused code',
		priority: 'normal',
		due_date: '2025-03-16T00:00:00Z',
		status_id: 's-3',
		updated_at: '2025-03-04T07:30:00Z',
		tag_ids: ['t-4', 't-6'],
		sub_tasks: [],
	},
]

export const StatusColors = [
	'#F44336', // Red
	'#E91E63', // Pink
	'#9C27B0', // Purple
	'#673AB7', // Deep Purple
	'#3F51B5', // Indigo
	'#2196F3', // Blue
	'#03A9F4', // Light Blue
	'#00BCD4', // Cyan
	'#009688', // Teal
	'#4CAF50', // Green
	'#8BC34A', // Light Green
	'#CDDC39', // Lime
	'#FFEB3B', // Yellow
	'#FFC107', // Amber
	'#FF9800', // Orange
	'#FF5722', // Deep Orange
	'#795548', // Brown
	'#9E9E9E', // Grey
	'#607D8B', // Blue Grey
	'#000000', // Black
	'#B71C1C', // Dark Red
	'#880E4F', // Dark Pink
	'#4A148C', // Dark Purple
	'#311B92', // Deep Indigo
	'#1A237E', // Navy Blue
	'#01579B', // Strong Blue
	'#006064', // Dark Cyan
	'#1B5E20', // Dark Green
	'#33691E', // Olive Green
	'#827717', // Dark Lime
	'#F57F17', // Mustard
	'#E65100', // Burnt Orange
	'#BF360C', // Brick
	'#3E2723', // Coffee Brown
	'#616161', // Dark Grey
	'#455A64', // Steel Blue Grey
	'#90CAF9', // Soft Blue
	'#A5D6A7', // Soft Green
	'#FFF59D', // Soft Yellow
	'#FFAB91', // Soft Orange
]
