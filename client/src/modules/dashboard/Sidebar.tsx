import { GalleryVerticalEnd, ScrollText } from 'lucide-react'
import * as React from 'react'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import { UserNav } from './UserNav'
import { useAuth } from '@/context/AuthContext'
import { useSpaces } from '@/services/queries'
import { Link } from 'react-router'

const items = [
	{
		title: 'Installation',
		url: '#',
	},
	{
		title: 'Project Structure',
		url: '#',
	},
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuth()
	const { data: spaces } = useSpaces()

	console.log(spaces)

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="#">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">Tasksflow</span>
									<span className="">v1.0.0</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Spaces</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{spaces?.map((space) => (
								<SidebarMenuItem key={space.id}>
									<Link to={`/${space.id}`}>
										<SidebarMenuButton>
											<ScrollText className="h-5 w-5" />
											{space.title}
										</SidebarMenuButton>
									</Link>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarRail />

			<SidebarFooter>
				<UserNav
					user={{
						email: user?.email,
						name: user?.name,
						avatar: '',
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	)
}
