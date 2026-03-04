<script lang="ts">
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Spinner } from '$lib/shared/components/ui/spinner/index.js';

	import Example from '../example.svelte';
</script>

<Example title="In Badges" class="items-center justify-center">
	<div class="flex flex-wrap items-center justify-center gap-4">
		<Badge>
			<Spinner data-icon="inline-start" />
			Badge
		</Badge>
		<Badge variant="secondary">
			<Spinner data-icon="inline-start" />
			Badge
		</Badge>
		<Badge variant="destructive">
			<Spinner data-icon="inline-start" />
			Badge
		</Badge>
		<Badge variant="outline">
			<Spinner data-icon="inline-start" />
			Badge
		</Badge>
	</div>
</Example>
