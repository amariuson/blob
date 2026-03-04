<script lang="ts">
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import InboxIcon from '@lucide/svelte/icons/inbox';

	import Example from '../example.svelte';
</script>

<Example title="ItemSeparator">
	<div class="flex w-full flex-col gap-4">
		<Item.Group>
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Inbox</Item.Title>
					<Item.Description>View all incoming messages.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Separator />
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Sent</Item.Title>
					<Item.Description>View all sent messages.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Separator />
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Drafts</Item.Title>
					<Item.Description>View all draft messages.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Separator />
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Archive</Item.Title>
					<Item.Description>View archived messages.</Item.Description>
				</Item.Content>
			</Item.Root>
		</Item.Group>
	</div>
</Example>
