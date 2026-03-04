<script lang="ts">
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<div class="flex flex-wrap items-center gap-2">
		<Toggle aria-label="Toggle disabled" disabled>Disabled</Toggle>
		<Toggle variant="outline" aria-label="Toggle disabled outline" disabled>Disabled</Toggle>
	</div>
</Example>
