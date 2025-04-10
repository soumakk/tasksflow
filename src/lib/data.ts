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
		id: '1',
		name: 'Todo',
		color: '#FF5733',
		created_at: '2025-03-08T10:00:00Z',
		updated_at: '2025-03-08T10:00:00Z',
	},
	{
		id: '2',
		name: 'In Progress',
		color: '#FFC300',
		created_at: '2025-03-08T10:00:00Z',
		updated_at: '2025-03-08T10:00:00Z',
	},
	{
		id: '3',
		name: 'Done',
		color: '#28A745',
		created_at: '2025-03-08T10:00:00Z',
		updated_at: '2025-03-08T10:00:00Z',
	},
]

export const defaultTags: ITag[] = [
	{ id: '1', name: 'Urgent', color: '#D9534F', created_at: '2025-03-08T10:00:00Z' },
	{ id: '2', name: 'Bug', color: '#F0AD4E', created_at: '2025-03-08T10:00:00Z' },
	{ id: '3', name: 'Feature', color: '#5BC0DE', created_at: '2025-03-08T10:00:00Z' },
]

export const defaultTasks: ITask[] = [
	{
		id: '1',
		created_at: '2025-03-08T10:05:00Z',
		title: 'Fix login issue',
		description: 'Users cannot log in on mobile',
		priority: 'high',
		due_date: '2025-03-10T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:05:00Z',
		tag_ids: [],
	},
	{
		id: '2',
		created_at: '2025-03-08T10:06:00Z',
		title: 'Design homepage UI',
		description: 'Revamp the homepage layout',
		priority: 'normal',
		due_date: '2025-03-15T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:06:00Z',
		tag_ids: [],
	},
	{
		id: '3',
		created_at: '2025-03-08T10:07:00Z',
		title: 'Database optimization',
		description: 'Improve query performance',
		priority: 'high',
		due_date: '2025-03-12T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:07:00Z',
		tag_ids: [],
	},
	{
		id: '4',
		created_at: '2025-03-08T10:08:00Z',
		title: 'Update user profile API',
		description: null,
		priority: 'low',
		due_date: '2025-03-20T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:08:00Z',
		tag_ids: [],
	},
	{
		id: '5',
		created_at: '2025-03-08T10:09:00Z',
		title: 'Implement dark mode',
		description: 'Add dark mode toggle in settings',
		priority: 'normal',
		due_date: '2025-03-18T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:09:00Z',
		tag_ids: [],
	},
	{
		id: '6',
		created_at: '2025-03-08T10:10:00Z',
		title: 'Fix checkout bug',
		description: 'Users unable to complete purchases',
		priority: 'urgent',
		due_date: '2025-03-09T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:10:00Z',
		tag_ids: [],
	},
	{
		id: '7',
		created_at: '2025-03-08T10:11:00Z',
		title: 'Optimize images',
		description: 'Reduce image size for better loading',
		priority: 'low',
		due_date: '2025-03-22T00:00:00Z',
		status_id: '3',
		updated_at: '2025-03-08T10:11:00Z',
		tag_ids: [],
	},
	{
		id: '8',
		created_at: '2025-03-08T10:12:00Z',
		title: 'Write unit tests',
		description: 'Increase code coverage',
		priority: 'normal',
		due_date: '2025-03-25T00:00:00Z',
		status_id: '3',
		updated_at: '2025-03-08T10:12:00Z',
		tag_ids: [],
	},
	{
		id: '9',
		created_at: '2025-03-08T10:13:00Z',
		title: 'Deploy new version',
		description: 'Deploy the latest build to production',
		priority: 'high',
		due_date: '2025-03-08T23:59:00Z',
		status_id: '3',
		updated_at: '2025-03-08T10:13:00Z',
		tag_ids: [],
	},
	{
		id: '10',
		created_at: '2025-03-08T10:14:00Z',
		title: 'Refactor CSS',
		description: 'Clean up unused styles',
		priority: 'low',
		due_date: '2025-03-30T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:14:00Z',
		tag_ids: [],
	},
	{
		id: '11',
		created_at: '2025-03-08T10:15:00Z',
		title: 'Improve accessibility',
		description: 'Ensure compliance with WCAG',
		priority: 'high',
		due_date: '2025-03-28T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:15:00Z',
		tag_ids: [],
	},
	{
		id: '12',
		created_at: '2025-03-08T10:16:00Z',
		title: 'Update documentation',
		description: 'Refresh API docs',
		priority: 'normal',
		due_date: '2025-03-24T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:16:00Z',
		tag_ids: [],
	},
	{
		id: '13',
		created_at: '2025-03-08T10:17:00Z',
		title: 'Fix 404 error',
		description: 'Resolve broken links',
		priority: 'urgent',
		due_date: '2025-03-19T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:17:00Z',
		tag_ids: [],
	},
	{
		id: '14',
		created_at: '2025-03-08T10:18:00Z',
		title: 'Enhance search functionality',
		description: 'Improve search algorithm',
		priority: 'high',
		due_date: '2025-03-26T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:18:00Z',
		tag_ids: [],
	},
	{
		id: '15',
		created_at: '2025-03-08T10:19:00Z',
		title: 'Integrate payment gateway',
		description: 'Add Stripe support',
		priority: 'high',
		due_date: '2025-03-29T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:19:00Z',
		tag_ids: [],
	},
	{
		id: '16',
		created_at: '2025-03-08T10:20:00Z',
		title: 'Implement two-factor authentication',
		description: 'Enhance security with 2FA',
		priority: 'high',
		due_date: '2025-04-01T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:20:00Z',
		tag_ids: [],
	},
	{
		id: '17',
		created_at: '2025-03-08T10:21:00Z',
		title: 'Improve caching strategy',
		description: 'Optimize site performance',
		priority: 'normal',
		due_date: '2025-04-05T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:21:00Z',
		tag_ids: [],
	},
	{
		id: '18',
		created_at: '2025-03-08T10:22:00Z',
		title: 'Upgrade database version',
		description: 'Migrate to latest PostgreSQL',
		priority: 'high',
		due_date: '2025-04-10T00:00:00Z',
		status_id: '3',
		updated_at: '2025-03-08T10:22:00Z',
		tag_ids: [],
	},
	{
		id: '19',
		created_at: '2025-03-08T10:23:00Z',
		title: 'Develop mobile app prototype',
		description: 'Create an MVP for Android',
		priority: 'urgent',
		due_date: '2025-04-12T00:00:00Z',
		status_id: '1',
		updated_at: '2025-03-08T10:23:00Z',
		tag_ids: [],
	},
	{
		id: '20',
		created_at: '2025-03-08T10:24:00Z',
		title: 'Implement chatbot support',
		description: 'Add AI-driven chatbot',
		priority: 'high',
		due_date: '2025-04-15T00:00:00Z',
		status_id: '2',
		updated_at: '2025-03-08T10:24:00Z',
		tag_ids: [],
	},
]
