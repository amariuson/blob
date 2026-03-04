<script lang="ts">
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import Example from '../example.svelte';
</script>

<Example title="On Link">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<a
					href="/"
					class="w-fit text-sm text-primary underline-offset-4 hover:underline"
					onclick={(e) => e.preventDefault()}
					{...props}
				>
					Learn more
				</a>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Click to read the documentation</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Example>
