<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Empty from '$lib/shared/components/ui/empty/index.js';

	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

	import Example from '../example.svelte';
</script>

<Example title="With Muted Background">
	<Empty.Root class="bg-muted">
		<Empty.Header>
			<Empty.Title>No results found</Empty.Title>
			<Empty.Description>
				No results found for your search. Try adjusting your search terms.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button>Try again</Button>
			<Button variant="link" href="#/" class="text-muted-foreground">
				Learn more
				<ArrowUpRightIcon />
			</Button>
		</Empty.Content>
	</Empty.Root>
</Example>
