<script lang="ts">
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import InboxIcon from '@lucide/svelte/icons/inbox';

	import Example from '../example.svelte';
</script>

<Example title="Outline - ItemGroup">
	<div class="flex w-full flex-col gap-4">
		<Item.Group>
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Item 1</Item.Title>
					<Item.Description>First item with icon.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Item 2</Item.Title>
					<Item.Description>Second item with icon.</Item.Description>
				</Item.Content>
			</Item.Root>
			<Item.Root variant="outline">
				<Item.Media variant="icon">
					<InboxIcon />
				</Item.Media>
				<Item.Content>
					<Item.Title>Item 3</Item.Title>
					<Item.Description>Third item with icon.</Item.Description>
				</Item.Content>
			</Item.Root>
		</Item.Group>
	</div>
</Example>
