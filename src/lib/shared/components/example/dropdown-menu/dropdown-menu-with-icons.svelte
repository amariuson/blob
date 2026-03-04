<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UserIcon from '@lucide/svelte/icons/user';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Open</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Item>
				<UserIcon />
				Profile
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<CreditCardIcon />
				Billing
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<SettingsIcon />
				Settings
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive">
				<LogOutIcon />
				Log out
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
