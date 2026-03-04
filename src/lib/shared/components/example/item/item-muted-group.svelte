<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Muted - ItemGroup">
	<div class="flex w-full flex-col gap-4">
		<Item.Group>
			<Item.Root variant="muted">
				<Item.Content>
					<Item.Title>Item 1</Item.Title>
					<Item.Description>First item in muted group.</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="outline" size="sm">Action</Button>
				</Item.Actions>
			</Item.Root>
			<Item.Root variant="muted">
				<Item.Content>
					<Item.Title>Item 2</Item.Title>
					<Item.Description>Second item in muted group.</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="outline" size="sm">Action</Button>
				</Item.Actions>
			</Item.Root>
			<Item.Root variant="muted">
				<Item.Content>
					<Item.Title>Item 3</Item.Title>
					<Item.Description>Third item in muted group.</Item.Description>
				</Item.Content>
				<Item.Actions>
					<Button variant="outline" size="sm">Action</Button>
				</Item.Actions>
			</Item.Root>
		</Item.Group>
	</div>
</Example>
