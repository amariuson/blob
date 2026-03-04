<script lang="ts">
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';

	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<Kbd.Group>
		<Kbd.Root>
			<CircleDashedIcon />
		</Kbd.Root>
		<Kbd.Root>
			<ArrowLeftIcon />
		</Kbd.Root>
		<Kbd.Root>
			<ArrowRightIcon />
		</Kbd.Root>
	</Kbd.Group>
</Example>
