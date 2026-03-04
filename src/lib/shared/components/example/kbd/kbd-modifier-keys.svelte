<script lang="ts">
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Modifier Keys">
	<div class="flex items-center gap-2">
		<Kbd.Root>⌘</Kbd.Root>
		<Kbd.Root>C</Kbd.Root>
	</div>
</Example>
