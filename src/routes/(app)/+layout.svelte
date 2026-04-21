<script lang="ts">
	import type { Snippet } from 'svelte';

	import { ImpersonationBanner } from '$features/admin';
	import { getSessionQuery, signOutUserForm } from '$features/auth';
	import AppSidebar from '$lib/shared/components/sidebar/app-sidebar.svelte';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';

	let { children }: { children: Snippet } = $props();

	const session = $derived(await getSessionQuery());
	const user = $derived({
		name: session.user.name,
		email: session.user.email,
		avatar: session.user.image ?? ''
	});
	const isAdmin = $derived(session.user.role === 'superadmin');
</script>

<ImpersonationBanner>
	<Sidebar.Provider>
		<AppSidebar {user} {isAdmin} {signOutUserForm} />
		<Sidebar.Inset>
			<header
				class="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-2 group-data-[active=true]/banner:static"
			>
				<div class="flex h-8 items-center gap-2 px-1">
					<Sidebar.Trigger />
				</div>
			</header>
			<div class="flex flex-1 flex-col gap-4">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</ImpersonationBanner>
