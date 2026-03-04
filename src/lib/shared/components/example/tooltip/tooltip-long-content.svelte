<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Long Content">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Show Tooltip</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			To learn more about how this works, check out the docs. If you have any questions, please
			reach out to us.
		</Tooltip.Content>
	</Tooltip.Root>
</Example>
