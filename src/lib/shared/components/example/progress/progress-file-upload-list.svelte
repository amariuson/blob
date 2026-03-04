<script lang="ts">
	import * as Item from '$lib/shared/components/ui/item/index.js';
	import { Progress } from '$lib/shared/components/ui/progress/index.js';

	import FileIcon from '@lucide/svelte/icons/file';

	import Example from '../example.svelte';
	const files = [
		{
			id: '1',
			name: 'document.pdf',
			progress: 45,
			timeRemaining: '2m 30s'
		},
		{
			id: '2',
			name: 'presentation.pptx',
			progress: 78,
			timeRemaining: '45s'
		},
		{
			id: '3',
			name: 'spreadsheet.xlsx',
			progress: 12,
			timeRemaining: '5m 12s'
		},
		{
			id: '4',
			name: 'image.jpg',
			progress: 100,
			timeRemaining: 'Complete'
		}
	];
</script>

<Example title="File Upload List">
	<Item.Group>
		{#each files as file (file.id)}
			<Item.Root size="xs" class="px-0">
				<Item.Media variant="icon">
					<FileIcon class="size-5" />
				</Item.Media>
				<Item.Content class="inline-block truncate">
					<Item.Title class="inline">{file.name}</Item.Title>
				</Item.Content>
				<Item.Content>
					<Progress value={file.progress} class="w-32" />
				</Item.Content>
				<Item.Actions class="w-16 justify-end">
					<span class="text-sm text-muted-foreground">{file.timeRemaining}</span>
				</Item.Actions>
			</Item.Root>
		{/each}
	</Item.Group>
</Example>
