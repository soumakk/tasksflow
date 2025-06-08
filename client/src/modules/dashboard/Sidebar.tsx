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
							{items?.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton>
										<ScrollText className="h-5 w-5" />
										{item.title}
									</SidebarMenuButton>
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
						email: 'soumak@gmail.com',
						name: 'Soumak',
						avatar: '',
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	)
}
