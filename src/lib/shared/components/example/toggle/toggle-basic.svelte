<script lang="ts">
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<div class="flex flex-wrap items-center gap-2">
		<Toggle aria-label="Toggle bold" pressed>
			<BoldIcon />
		</Toggle>
		<Toggle aria-label="Toggle italic">
			<ItalicIcon />
		</Toggle>
		<Toggle aria-label="Toggle underline">
			<UnderlineIcon />
		</Toggle>
	</div>
</Example>
