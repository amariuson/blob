<script lang="ts">
	import * as Button from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="With Image (Small)">
	<Card.Root size="sm" class="relative mx-auto w-full max-w-sm pt-0">
		<div class="inse.t-0 absolute z-30 aspect-video bg-primary opacity-50 mix-blend-color"></div>
		<img
			src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="by mymind on Unsplash"
			class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
		/>
		<Card.Header>
			<Card.Title>Beautiful Landscape</Card.Title>
			<Card.Description>
				A stunning view that captures the essence of natural beauty.
			</Card.Description>
		</Card.Header>
		<Card.Footer>
			<Button.Root size="sm" class="w-full">
				<PlusIcon data-icon="inline-start" />
				Button
			</Button.Root>
		</Card.Footer>
	</Card.Root>
</Example>
