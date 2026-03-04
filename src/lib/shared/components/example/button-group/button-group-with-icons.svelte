<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import FlipHorizontalIcon from '@lucide/svelte/icons/flip-horizontal';
	import FlipVerticalIcon from '@lucide/svelte/icons/flip-vertical';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<div class="flex flex-col gap-4">
		<ButtonGroup>
			<Button variant="outline">
				<FlipHorizontalIcon />
			</Button>
			<Button variant="outline">
				<FlipVerticalIcon />
			</Button>
			<Button variant="outline">
				<RotateCwIcon />
			</Button>
		</ButtonGroup>
	</div>
</Example>
