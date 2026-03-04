<script lang="ts">
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Drawer from '$lib/shared/components/ui/drawer/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import BotIcon from '@lucide/svelte/icons/bot';
	import CircleIcon from '@lucide/svelte/icons/circle';
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import CodeIcon from '@lucide/svelte/icons/code';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import GitBranchIcon from '@lucide/svelte/icons/git-branch';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import HomeIcon from '@lucide/svelte/icons/home';
	import LayoutGridIcon from '@lucide/svelte/icons/layout-grid';
	import LinkIcon from '@lucide/svelte/icons/link';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import SearchIcon from '@lucide/svelte/icons/search';
	import ServerIcon from '@lucide/svelte/icons/server';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import StarIcon from '@lucide/svelte/icons/star';
	import UserIcon from '@lucide/svelte/icons/user';
	import XIcon from '@lucide/svelte/icons/x';

	import Example from '../example.svelte';
</script>

<Example title="Account Menu">
	<header class="flex h-14 w-full items-center gap-2">
		<Drawer.Root direction="left">
			<Drawer.Trigger>
				{#snippet child({ props })}
					<Button variant="outline" size="icon" {...props}>
						<MenuIcon />
						<span class="sr-only">Open menu</span>
					</Button>
				{/snippet}
			</Drawer.Trigger>
			<Drawer.Content class="max-w-72">
				<Drawer.Header class="flex flex-row items-center justify-between px-5 pb-0">
					<Drawer.Title>Menu</Drawer.Title>
					<Drawer.Close>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon-sm" {...props}>
								<XIcon />
								<span class="sr-only">Close</span>
							</Button>
						{/snippet}
					</Drawer.Close>
				</Drawer.Header>
				<div class="p-2">
					<Item.Group class="gap-px">
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<HomeIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Home</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<CircleIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Issues</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<GitBranchIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Pull requests</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<LayoutGridIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Projects</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<MailIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Discussions</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<ServerIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Codespaces</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<BotIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Copilot</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<SparklesIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Spark</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Separator />
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<SearchIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Explore</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<ShoppingBagIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>Marketplace</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
						<Item.Root size="xs">
							{#snippet child({ props })}
								<a href="#/" {...props}>
									<Item.Media variant="icon">
										<LinkIcon />
									</Item.Media>
									<Item.Content>
										<Item.Title>MCP registry</Item.Title>
									</Item.Content>
								</a>
							{/snippet}
						</Item.Root>
					</Item.Group>
				</div>
			</Drawer.Content>
		</Drawer.Root>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button variant="ghost" size="icon" class="ml-auto rounded-full" {...props}>
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />
							<Avatar.Fallback>SC</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" align="end">
				<DropdownMenu.Group>
					<DropdownMenu.Label class="p-0 font-normal">
						<Item.Root class="px-2 py-1 pb-0.5" size="sm">
							<Item.Media>
								<Avatar.Root>
									<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />
									<Avatar.Fallback>SC</Avatar.Fallback>
								</Avatar.Root>
							</Item.Media>
							<Item.Content class="gap-0">
								<Item.Title class="text-sm text-foreground">shadcn</Item.Title>
								<Item.Description class="text-xs">shadcn@example.com</Item.Description>
							</Item.Content>
						</Item.Root>
					</DropdownMenu.Label>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<SmileIcon />
						Set status
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CircleAlertIcon />
						Single sign-on
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<UserIcon />
						Profile
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FolderIcon />
						Repositories
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<StarIcon />
						Stars
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CodeIcon />
						Gists
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<FolderIcon />
						Organizations
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<ServerIcon />
						Enterprises
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<HeartIcon />
						Sponsors
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<SettingsIcon />
						Settings
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<BotIcon />
						Copilot settings
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<SparklesIcon />
						Feature preview
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<MonitorIcon />
						Appearance
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<UserIcon />
						Accessibility
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<ArrowUpIcon />
						Upgrade
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<LogOutIcon />
					Sign out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</header>
</Example>
