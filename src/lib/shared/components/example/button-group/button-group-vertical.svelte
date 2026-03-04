<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';

	import MinusIcon from '@lucide/svelte/icons/minus';
	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="Vertical">
	<div class="flex gap-6">
		<ButtonGroup orientation="vertical" aria-label="Media controls" class="h-fit">
			<Button variant="outline" size="icon">
				<PlusIcon />
			</Button>
			<Button variant="outline" size="icon">
				<MinusIcon />
			</Button>
		</ButtonGroup>
	</div>
</Example>
