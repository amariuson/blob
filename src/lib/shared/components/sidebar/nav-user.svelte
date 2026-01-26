<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';

	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/shared/components/ui/sidebar/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	let {
		user,
		signOutUserForm
	}: {
		user: { name: string; email: string; avatar: string };
		signOutUserForm: RemoteForm<void, void>;
	} = $props();
	const fallback = $derived(
		user.name.includes(' ')
			? user.name.split(' ')[0][0] + user.name.split(' ')[1][0]
			: user.name.slice(0, 2)
	);
	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						class="group-data-[collapsible=icon]:p-1! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						<Avatar.Root class="size-6">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded bg-amber-400 text-[10px]"
								>{fallback.toUpperCase()}</Avatar.Fallback
							>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
						</div>
						<ChevronsUpDownIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<SparklesIcon />
						Upgrade to Pro
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href="/settings" {...props}>
								<SettingsIcon />
								Settings
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href="/settings/profile" {...props}>
								<BadgeCheckIcon />
								Account
							</a>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
							<a href="/settings/notifications" {...props}>
								<BellIcon />
								Notifications
							</a>
						{/snippet}
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<form {...formHandler(signOutUserForm)}>
					<DropdownMenu.Item class="flex w-full">
						{#snippet child({ props })}
							<button {...props}>
								<LogOutIcon />
								Log out
							</button>
						{/snippet}
					</DropdownMenu.Item>
				</form>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
