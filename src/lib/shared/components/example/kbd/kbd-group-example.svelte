<script lang="ts">
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import Example from '../example.svelte';
</script>

<Example title="KbdGroup">
	<Kbd.Group>
		<Kbd.Root>Ctrl</Kbd.Root>
		<Kbd.Root>Shift</Kbd.Root>
		<Kbd.Root>P</Kbd.Root>
	</Kbd.Group>
</Example>
