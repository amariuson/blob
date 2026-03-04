<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';

	import Example from '../example.svelte';
</script>

<Example title="With Button Icon + Text">
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<Button size="sm" variant="outline">
				<BoldIcon data-icon="inline-start" />
				Button
			</Button>
			<Toggle variant="outline" aria-label="Toggle sm icon text" size="sm">
				<BoldIcon />
				Toggle
			</Toggle>
		</div>
		<div class="flex items-center gap-2">
			<Button size="default" variant="outline">
				<ItalicIcon data-icon="inline-start" />
				Button
			</Button>
			<Toggle variant="outline" aria-label="Toggle default icon text" size="default">
				<ItalicIcon />
				Toggle
			</Toggle>
		</div>
		<div class="flex items-center gap-2">
			<Button size="lg" variant="outline">
				<UnderlineIcon data-icon="inline-start" />
				Button
			</Button>
			<Toggle variant="outline" aria-label="Toggle lg icon text" size="lg">
				<UnderlineIcon />
				Toggle
			</Toggle>
		</div>
	</div>
</Example>
