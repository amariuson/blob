<script lang="ts">
	import * as ToggleGroup from '$lib/shared/components/ui/toggle-group/index.js';

	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import TrendingUpIcon from '@lucide/svelte/icons/trending-up';

	import Example from '../example.svelte';
	let value = $state('newest');
</script>

<Example title="Sort">
	<ToggleGroup.Root type="single" bind:value variant="outline" size="sm">
		<ToggleGroup.Item value="newest" aria-label="Newest">
			<ArrowDownIcon />
			Newest
		</ToggleGroup.Item>
		<ToggleGroup.Item value="oldest" aria-label="Oldest">
			<ArrowUpIcon />
			Oldest
		</ToggleGroup.Item>
		<ToggleGroup.Item value="popular" aria-label="Popular">
			<TrendingUpIcon />
			Popular
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</Example>
