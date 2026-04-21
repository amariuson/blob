<script lang="ts">
	import { env } from '$env/dynamic/public';

	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
	import { Button } from '$lib/shared/components/ui/button';

	type Props = {
		user: { name: string; email: string; avatar: string };
		isAdmin: boolean;
		signOutUserForm: Parameters<typeof formHandler>[0];
	};

	let { user, isAdmin, signOutUserForm }: Props = $props();

	const appName = env.PUBLIC_APP_NAME;
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="px-2 py-1 text-sm font-semibold">{appName}</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- Nav items land when DMC features exist -->
	</Sidebar.Content>
	<Sidebar.Footer>
		<div class="flex flex-col gap-1 px-2 py-2">
			<div class="truncate text-sm font-medium">{user.name}</div>
			<div class="truncate text-xs text-muted-foreground">{user.email}</div>
			{#if isAdmin}
				<Button variant="ghost" size="sm" class="mt-1 justify-start">Admin</Button>
			{/if}
			<form {...formHandler(signOutUserForm)}>
				<Button variant="ghost" size="sm" class="mt-1 w-full justify-start" type="submit">
					Sign out
				</Button>
			</form>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
