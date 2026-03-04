<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import InfoIcon from '@lucide/svelte/icons/info';

	import Example from '../example.svelte';
</script>

<Example title="With Icon">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<InfoIcon />
					<span class="sr-only">Info</span>
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Additional information</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Example>
