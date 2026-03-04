<script lang="ts">
	import { Badge } from '$lib/shared/components/ui/badge/index.js';

	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';

	import Example from '../example.svelte';
</script>

<Example title="Icon Left" class="max-w-fit">
	<div class="flex flex-wrap gap-2">
		<Badge>
			<BadgeCheckIcon data-icon="inline-start" />
			Default
		</Badge>
		<Badge variant="secondary">
			<BadgeCheckIcon data-icon="inline-start" />
			Secondary
		</Badge>
		<Badge variant="destructive">
			<BadgeCheckIcon data-icon="inline-start" />
			Destructive
		</Badge>
		<Badge variant="outline">
			<BadgeCheckIcon data-icon="inline-start" />
			Outline
		</Badge>
		<Badge variant="ghost">
			<BadgeCheckIcon data-icon="inline-start" />
			Ghost
		</Badge>
		<Badge variant="link">
			<BadgeCheckIcon data-icon="inline-start" />
			Link
		</Badge>
	</div>
</Example>
