<script lang="ts">
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="Observability" class="items-center justify-center">
	<Card.Root class="relative w-full max-w-md overflow-hidden pt-0">
		<div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color"></div>
		<img
			src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
			alt="by mymind on Unsplash"
			title="Photo by mymind on Unsplash"
			class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
		/>
		<Card.Header>
			<Card.Title>Observability Plus is replacing Monitoring</Card.Title>
			<Card.Description>
				Switch to the improved way to explore your data, with natural language. Monitoring will no
				longer be available on the Pro plan in November, 2025
			</Card.Description>
		</Card.Header>
		<Card.Footer>
			<Button>
				Create Query
				<PlusIcon data-icon="inline-end" />
			</Button>
			<Badge variant="secondary" class="ml-auto">Warning</Badge>
		</Card.Footer>
	</Card.Root>
</Example>
