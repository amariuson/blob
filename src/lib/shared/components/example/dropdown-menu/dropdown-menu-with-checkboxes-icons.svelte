<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import BellIcon from '@lucide/svelte/icons/bell';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MessageSquareIcon from '@lucide/svelte/icons/message-square';

	import Example from '../example.svelte';
	let notifications = $state({
		email: true,
		sms: false,
		push: true
	});
</script>

<Example title="Checkboxes with Icons">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Notifications</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="min-w-56">
			<DropdownMenu.Group>
				<DropdownMenu.Label>Notification Preferences</DropdownMenu.Label>
				<DropdownMenu.CheckboxItem
					checked={notifications.email}
					onCheckedChange={(checked) =>
						(notifications = { ...notifications, email: checked === true })}
				>
					<MailIcon />
					Email notifications
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem
					checked={notifications.sms}
					onCheckedChange={(checked) =>
						(notifications = { ...notifications, sms: checked === true })}
				>
					<MessageSquareIcon />
					SMS notifications
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem
					checked={notifications.push}
					onCheckedChange={(checked) =>
						(notifications = { ...notifications, push: checked === true })}
				>
					<BellIcon />
					Push notifications
				</DropdownMenu.CheckboxItem>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
