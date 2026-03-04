<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Sides">
	<div class="flex flex-wrap gap-2">
		{#each ['top', 'right', 'bottom', 'left'] as const as side (side)}
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" class="w-fit capitalize" {...props}>{side}</Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content {side}>
					<p>Add to library</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>
</Example>
