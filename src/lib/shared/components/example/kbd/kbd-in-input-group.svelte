<script lang="ts">
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import Example from '../example.svelte';
</script>

<Example title="InputGroup">
	<InputGroup.Root>
		<InputGroup.Input />
		<InputGroup.Addon>
			<Kbd.Root>Space</Kbd.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
</Example>
