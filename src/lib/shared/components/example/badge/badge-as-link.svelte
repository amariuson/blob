<script lang="ts">
	import { Badge } from '$lib/shared/components/ui/badge/index.js';

	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

	import Example from '../example.svelte';
</script>

<Example title="As Link">
	<div class="flex flex-wrap gap-2">
		<Badge href="#/">
			Link
			<ArrowUpRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="secondary" href="#/">
			Link
			<ArrowUpRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="destructive" href="#/">
			Link
			<ArrowUpRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="ghost" href="#/">
			Link
			<ArrowUpRightIcon data-icon="inline-end" />
		</Badge>
	</div>
</Example>
