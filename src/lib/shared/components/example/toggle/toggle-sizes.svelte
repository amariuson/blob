<script lang="ts">
	import { Toggle } from '$lib/shared/components/ui/toggle/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Sizes">
	<div class="flex flex-wrap items-center gap-2">
		<Toggle variant="outline" aria-label="Toggle small" size="sm">Small</Toggle>
		<Toggle variant="outline" aria-label="Toggle default" size="default">Default</Toggle>
		<Toggle variant="outline" aria-label="Toggle large" size="lg">Large</Toggle>
	</div>
</Example>
