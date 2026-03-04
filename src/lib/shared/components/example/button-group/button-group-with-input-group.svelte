<script lang="ts">
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';

	import SearchIcon from '@lucide/svelte/icons/search';

	import Example from '../example.svelte';
</script>

<Example title="With Input Group">
	<div class="flex flex-col gap-4">
		<InputGroup.Root>
			<InputGroup.Input placeholder="Type to search..." />
			<InputGroup.Addon align="inline-start" class="text-muted-foreground">
				<SearchIcon />
			</InputGroup.Addon>
		</InputGroup.Root>
	</div>
</Example>
