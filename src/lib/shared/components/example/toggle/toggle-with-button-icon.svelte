<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';

	import Example from '../example.svelte';
</script>

<Example title="With Button Icon">
	<div class="flex flex-col gap-4">
		<div class="flex items-center gap-2">
			<Button variant="outline" size="icon-sm">
				<BoldIcon />
			</Button>
			<Toggle variant="outline" aria-label="Toggle sm icon" size="sm">
				<BoldIcon />
			</Toggle>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="icon">
				<ItalicIcon />
			</Button>
			<Toggle variant="outline" aria-label="Toggle default icon" size="default">
				<ItalicIcon />
			</Toggle>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="icon-lg">
				<UnderlineIcon />
			</Button>
			<Toggle variant="outline" aria-label="Toggle lg icon" size="lg">
				<UnderlineIcon />
			</Toggle>
		</div>
	</div>
</Example>
