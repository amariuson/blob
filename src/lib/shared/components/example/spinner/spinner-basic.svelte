<script lang="ts">
	import { Spinner } from '$lib/shared/components/ui/spinner/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<div class="flex items-center gap-6">
		<Spinner />
		<Spinner class="size-6" />
	</div>
</Example>
