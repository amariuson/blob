<script lang="ts">
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<div class="flex items-center gap-2">
		<Kbd.Root>Ctrl</Kbd.Root>
		<Kbd.Root>⌘K</Kbd.Root>
		<Kbd.Root>Ctrl + B</Kbd.Root>
	</div>
</Example>
