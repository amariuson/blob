<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import InboxIcon from '@lucide/svelte/icons/inbox';

	import Example from '../example.svelte';
</script>

<Example title="Outline - Extra Small">
	<div class="flex w-full flex-col gap-4">
		<Item.Root variant="outline" size="xs">
			<Item.Content>
				<Item.Title>Title Only</Item.Title>
			</Item.Content>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Content>
				<Item.Title>Title + Button</Item.Title>
			</Item.Content>
			<Item.Actions>
				<Button variant="outline" size="sm">Action</Button>
			</Item.Actions>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Content>
				<Item.Title>Title + Description</Item.Title>
				<Item.Description>This is a description that provides additional context.</Item.Description>
			</Item.Content>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Content>
				<Item.Title>Title + Description + Button</Item.Title>
				<Item.Description>
					This item includes a title, description, and action button.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button variant="outline" size="sm">Action</Button>
			</Item.Actions>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Media variant="icon">
				<InboxIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Media + Title</Item.Title>
			</Item.Content>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Media variant="icon">
				<InboxIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Media + Title + Button</Item.Title>
			</Item.Content>
			<Item.Actions>
				<Button size="sm">Action</Button>
			</Item.Actions>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Media variant="icon">
				<InboxIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Media + Title + Description</Item.Title>
				<Item.Description>This item includes media, title, and description.</Item.Description>
			</Item.Content>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Media variant="icon">
				<InboxIcon />
			</Item.Media>
			<Item.Content>
				<Item.Title>Media + Title + Description + Button</Item.Title>
				<Item.Description>
					Complete item with all components: media, title, description, and button.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm">Action</Button>
			</Item.Actions>
		</Item.Root>
		<Item.Root variant="outline" size="xs">
			<Item.Content>
				<Item.Title>Multiple Actions</Item.Title>
				<Item.Description>Item with multiple action buttons in the actions area.</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button variant="outline" size="sm">Cancel</Button>
				<Button size="sm">Confirm</Button>
			</Item.Actions>
		</Item.Root>
	</div>
</Example>
