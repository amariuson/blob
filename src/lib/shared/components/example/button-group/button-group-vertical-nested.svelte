<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import CopyIcon from '@lucide/svelte/icons/copy';
	import FlipHorizontalIcon from '@lucide/svelte/icons/flip-horizontal';
	import FlipVerticalIcon from '@lucide/svelte/icons/flip-vertical';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
	import SearchIcon from '@lucide/svelte/icons/search';
	import ShareIcon from '@lucide/svelte/icons/share';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
</script>

<Example title="Vertical Nested">
	<ButtonGroup orientation="vertical" aria-label="Design tools palette">
		<ButtonGroup orientation="vertical">
			<Button variant="outline" size="icon">
				<SearchIcon />
			</Button>
			<Button variant="outline" size="icon">
				<CopyIcon />
			</Button>
			<Button variant="outline" size="icon">
				<ShareIcon />
			</Button>
		</ButtonGroup>
		<ButtonGroup orientation="vertical">
			<Button variant="outline" size="icon">
				<FlipHorizontalIcon />
			</Button>
			<Button variant="outline" size="icon">
				<FlipVerticalIcon />
			</Button>
			<Button variant="outline" size="icon">
				<RotateCwIcon />
			</Button>
		</ButtonGroup>
		<ButtonGroup>
			<Button variant="outline" size="icon">
				<TrashIcon />
			</Button>
		</ButtonGroup>
	</ButtonGroup>
</Example>
