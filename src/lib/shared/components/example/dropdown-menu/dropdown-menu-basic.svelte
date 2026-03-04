<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Open</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Item>Profile</DropdownMenu.Item>
				<DropdownMenu.Item>Billing</DropdownMenu.Item>
				<DropdownMenu.Item>Settings</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>GitHub</DropdownMenu.Item>
			<DropdownMenu.Item>Support</DropdownMenu.Item>
			<DropdownMenu.Item disabled>API</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
