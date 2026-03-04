<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Item from '$lib/shared/components/ui/item/index.js';

	import ShoppingBagIcon from '@lucide/svelte/icons/shopping-bag';

	import Example from '../example.svelte';
</script>

<Example title="Item">
	<div class="flex w-full max-w-md flex-col gap-6">
		<Item.Root variant="outline">
			<Item.Content>
				<Item.Title>Two-factor authentication</Item.Title>
				<Item.Description class="text-pretty xl:hidden 2xl:block">
					Verify via email or phone number.
				</Item.Description>
			</Item.Content>
			<Item.Actions>
				<Button size="sm" variant="secondary">Enable</Button>
			</Item.Actions>
		</Item.Root>
		<Item.Root variant="outline" size="sm">
			{#snippet child({ props })}
				<a href="#/" {...props}>
					<Item.Media variant="icon">
						<ShoppingBagIcon />
					</Item.Media>
					<Item.Content>
						<Item.Title>Your order has been shipped.</Item.Title>
					</Item.Content>
				</a>
			{/snippet}
		</Item.Root>
	</div>
</Example>
