<script lang="ts">
	import { Badge } from '$lib/shared/components/ui/badge/index.js';

	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	import Example from '../example.svelte';
</script>

<Example title="Icon Right" class="max-w-fit">
	<div class="flex flex-wrap gap-2">
		<Badge>
			Default
			<ArrowRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="secondary">
			Secondary
			<ArrowRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="destructive">
			Destructive
			<ArrowRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="outline">
			Outline
			<ArrowRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="ghost">
			Ghost
			<ArrowRightIcon data-icon="inline-end" />
		</Badge>
		<Badge variant="link">
			Link
			<ArrowRightIcon data-icon="inline-end" />
		</Badge>
	</div>
</Example>
