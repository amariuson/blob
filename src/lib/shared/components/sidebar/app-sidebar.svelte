<script lang="ts" module>
	import HouseIcon from '@lucide/svelte/icons/house';
	import ShieldIcon from '@lucide/svelte/icons/shield';

	const navMain = [
		{
			title: 'Home',
			url: '/',
			icon: HouseIcon,
			isActive: true
		}
	];

	const adminNav = [
		{
			title: 'Admin',
			url: '/admin',
			icon: ShieldIcon,
			isActive: false
		}
	];
</script>

<script lang="ts">
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import NavLogo from './nav-logo.svelte';
	import NavUser from './nav-user.svelte';
	import NavMain from './nav-main.svelte';
	import type { RemoteForm } from '@sveltejs/kit';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		user,
		isAdmin = false,
		signOutUserForm,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: { name: string; email: string; avatar: string };
		signOutUserForm: RemoteForm<void, void>;
		isAdmin?: boolean;
	} = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header class="border-b">
		<NavLogo />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navMain} />
		{#if isAdmin}
			<NavMain items={adminNav} label="Administration" />
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} {signOutUserForm} />
	</Sidebar.Footer>
</Sidebar.Root>
