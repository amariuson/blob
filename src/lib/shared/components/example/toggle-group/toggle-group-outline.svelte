<script lang="ts">
	import * as ToggleGroup from '$lib/shared/components/ui/toggle-group/index.js';

	import Example from '../example.svelte';

	let value = $state('all');
</script>

<Example title="Outline">
	<ToggleGroup.Root variant="outline" type="single" bind:value>
		<ToggleGroup.Item value="all" aria-label="Toggle all">All</ToggleGroup.Item>
		<ToggleGroup.Item value="missed" aria-label="Toggle missed">Missed</ToggleGroup.Item>
	</ToggleGroup.Root>
</Example>
