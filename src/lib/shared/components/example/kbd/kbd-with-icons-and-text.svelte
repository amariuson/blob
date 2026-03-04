<script lang="ts">
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';

	import Example from '../example.svelte';
</script>

<Example title="With Icons and Text">
	<Kbd.Group>
		<Kbd.Root>
			<ArrowLeftIcon />
			Left
		</Kbd.Root>
		<Kbd.Root>
			<CircleDashedIcon />
			Voice Enabled
		</Kbd.Root>
	</Kbd.Group>
</Example>
