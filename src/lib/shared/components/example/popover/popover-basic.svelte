<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Open Popover</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content align="start">
			<Popover.Header>
				<Popover.Title>Dimensions</Popover.Title>
				<Popover.Description>Set the dimensions for the layer.</Popover.Description>
			</Popover.Header>
		</Popover.Content>
	</Popover.Root>
</Example>
