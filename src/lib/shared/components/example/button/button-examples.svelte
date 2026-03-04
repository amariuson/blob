<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	import Example from '../example.svelte';
</script>

<Example title="Examples">
	<div class="flex flex-wrap items-center gap-4">
		<div class="flex items-center gap-2">
			<Button variant="outline">Cancel</Button>
			<Button>
				Submit
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="destructive">Delete</Button>
			<Button size="icon">
				<ArrowRightIcon data-icon="inline-end" />
			</Button>
		</div>
		<Button href="#/">Link</Button>
	</div>
</Example>
