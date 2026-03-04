<script lang="ts">
	import * as ToggleGroup from '$lib/shared/components/ui/toggle-group/index.js';

	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';

	import Example from '../example.svelte';
</script>

<Example title="Vertical Outline With Icons">
	<ToggleGroup.Root variant="outline" type="multiple" orientation="vertical" size="sm">
		<ToggleGroup.Item value="bold" aria-label="Toggle bold">
			<BoldIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="italic" aria-label="Toggle italic">
			<ItalicIcon />
		</ToggleGroup.Item>
		<ToggleGroup.Item value="underline" aria-label="Toggle underline">
			<UnderlineIcon />
		</ToggleGroup.Item>
	</ToggleGroup.Root>
</Example>
