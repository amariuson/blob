<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Empty from '$lib/shared/components/ui/empty/index.js';

	import FolderIcon from '@lucide/svelte/icons/folder';
	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="With Icon">
	<Empty.Root class="border">
		<Empty.Header>
			<Empty.Media variant="icon">
				<FolderIcon />
			</Empty.Media>
			<Empty.Title>Nothing to see here</Empty.Title>
			<Empty.Description>
				No posts have been created yet. Get started by <a href="#/">creating your first post</a>.
			</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<Button variant="outline">
				<PlusIcon data-icon="inline-start" />
				New Post
			</Button>
		</Empty.Content>
	</Empty.Root>
</Example>
