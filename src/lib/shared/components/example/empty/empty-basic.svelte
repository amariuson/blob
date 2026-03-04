<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Empty from '$lib/shared/components/ui/empty/index.js';

	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<Empty.Root>
		<Empty.Header>
			<Empty.Title>No projects yet</Empty.Title>
			<Empty.Description>
				You haven&apos;t created any projects yet. Get started by creating your first project.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<div class="flex gap-2">
				<Button href="#/">Create project</Button>
				<Button variant="outline">Import project</Button>
			</div>
			<Button variant="link" href="#/" class="text-muted-foreground">
				Learn more
				<ArrowUpRightIcon />
			</Button>
		</Empty.Content>
	</Empty.Root>
</Example>
