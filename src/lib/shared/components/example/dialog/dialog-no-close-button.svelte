<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';

	import Example from '../example.svelte';
</script>

<Example title="No Close Button" class="items-center justify-center">
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>No Close Button</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content showCloseButton={false}>
			<Dialog.Header>
				<Dialog.Title>No Close Button</Dialog.Title>
				<Dialog.Description>
					This dialog doesn&apos;t have a close button in the top-right corner.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Dialog.Close>
					{#snippet child({ props })}
						<Button variant="outline" {...props}>Close</Button>
					{/snippet}
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</Example>
