<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import { page } from '$app/state';

	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/shared/utils';

	import BellIcon from '@lucide/svelte/icons/bell';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import KeyIcon from '@lucide/svelte/icons/key';
	import PaletteIcon from '@lucide/svelte/icons/palette';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import UserIcon from '@lucide/svelte/icons/user';

	let { children }: { children: Snippet } = $props();

	const navItems: { title: string; href: string; icon: Component; description: string }[] = [
		{
			title: 'Profile',
			href: '/settings/profile',
			icon: UserIcon,
			description: 'Personal information'
		},
		{
			title: 'Security',
			href: '/settings/security',
			icon: ShieldIcon,
			description: 'Password and sessions'
		},
		{
			title: 'Preferences',
			href: '/settings/preferences',
			icon: PaletteIcon,
			description: 'Appearance settings'
		},
		{
			title: 'Notifications',
			href: '/settings/notifications',
			icon: BellIcon,
			description: 'Email preferences'
		},
		{
			title: 'Billing',
			href: '/settings/billing',
			icon: CreditCardIcon,
			description: 'Subscription and payments'
		},
		{
			title: 'Organization',
			href: '/settings/organization',
			icon: BuildingIcon,
			description: 'Team settings'
		},
		{
			title: 'Roles',
			href: '/settings/roles',
			icon: KeyIcon,
			description: 'Role permissions'
		}
	];

	const currentItem = $derived(
		navItems.find((item) => page.url.pathname === item.href) ?? navItems[0]
	);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="mx-auto w-full max-w-5xl py-4 md:py-6">
	<div class="mb-4 px-4 md:mb-6 md:px-0">
		<h1 class="text-xl font-semibold tracking-tight md:text-2xl">Settings</h1>
		<p class="text-sm text-muted-foreground">Manage your account and preferences</p>
	</div>

	<div class="flex flex-col gap-4 md:flex-row md:gap-6">
		<!-- Mobile: Dropdown selector -->
		<nav class="w-full shrink-0 px-4 md:hidden">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<button
							class="flex w-full items-center justify-between rounded-lg bg-muted px-3 py-2 text-left transition-colors hover:bg-muted/80"
							{...props}
						>
							<div class="flex items-center gap-2">
								<currentItem.icon class="size-4 text-muted-foreground" />
								<span class="text-sm font-medium">{currentItem.title}</span>
							</div>
							<ChevronsUpDownIcon class="size-4 text-muted-foreground" />
						</button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)" align="start">
					{#each navItems as item (item.href)}
						{@const isActive = page.url.pathname === item.href}
						<DropdownMenu.Item class={cn('py-2', isActive && 'bg-muted')}>
							{#snippet child({ props })}
								<a href={item.href} class="flex items-center gap-2" {...props}>
									<item.icon class="size-4" />
									<span class="font-medium">{item.title}</span>
								</a>
							{/snippet}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</nav>

		<!-- Desktop: Vertical sidebar -->
		<nav class="hidden w-52 shrink-0 md:block">
			<ul class="flex flex-col gap-0.5">
				{#each navItems as item (item.href)}
					{@const isActive = page.url.pathname === item.href}
					<li>
						<a
							href={item.href}
							class={cn(
								'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
								isActive
									? 'bg-muted text-foreground'
									: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
							)}
						>
							<div
								class={cn(
									'flex size-8 shrink-0 items-center justify-center rounded-md transition-colors',
									isActive ? 'bg-primary/10 text-primary' : 'bg-muted/50 group-hover:bg-muted'
								)}
							>
								<item.icon class="size-4" />
							</div>
							<div class="min-w-0">
								<div class={cn('text-sm', isActive && 'font-medium')}>{item.title}</div>
								<div class="truncate text-xs text-muted-foreground">{item.description}</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<main class="min-w-0 flex-1 px-4 md:px-0">
			{@render children()}
		</main>
	</div>
</div>
