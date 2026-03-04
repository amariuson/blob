<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	import Example from '../example.svelte';
</script>

<Example title="Navigation">
	<ButtonGroup>
		<ButtonGroup>
			<Button variant="outline">
				<ArrowLeftIcon />
			</Button>
			<Button variant="outline">
				<ArrowRightIcon />
			</Button>
		</ButtonGroup>
		<ButtonGroup aria-label="Single navigation button">
			<Button variant="outline" size="icon">
				<ArrowLeftIcon />
			</Button>
		</ButtonGroup>
	</ButtonGroup>
</Example>
