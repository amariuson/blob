<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Show Tooltip</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Add to library</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Example>
