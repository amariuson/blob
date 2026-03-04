<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	import Example from '../example.svelte';
</script>

<Example title="Pagination Split">
	<ButtonGroup>
		<ButtonGroup>
			<Button variant="outline" size="sm">1</Button>
			<Button variant="outline" size="sm">2</Button>
			<Button variant="outline" size="sm">3</Button>
			<Button variant="outline" size="sm">4</Button>
			<Button variant="outline" size="sm">5</Button>
		</ButtonGroup>
		<ButtonGroup>
			<Button variant="outline" size="icon-xs">
				<ArrowLeftIcon />
			</Button>
			<Button variant="outline" size="icon-xs">
				<ArrowRightIcon />
			</Button>
		</ButtonGroup>
	</ButtonGroup>
</Example>
