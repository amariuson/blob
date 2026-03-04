<script lang="ts">
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';

	import Example from '../example.svelte';
</script>

<Example title="Outline">
	<div class="flex flex-wrap items-center gap-2">
		<Toggle variant="outline" aria-label="Toggle italic">
			<ItalicIcon />
			Italic
		</Toggle>
		<Toggle variant="outline" aria-label="Toggle bold">
			<BoldIcon />
			Bold
		</Toggle>
	</div>
</Example>
