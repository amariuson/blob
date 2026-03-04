<script lang="ts">
	import * as ContextMenu from '$lib/shared/components/ui/context-menu/index.js';

	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import ShareIcon from '@lucide/svelte/icons/share';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
</script>

<Example title="With Destructive Items">
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
		>
			Right click here
		</ContextMenu.Trigger>
		<ContextMenu.Content>
			<ContextMenu.Group>
				<ContextMenu.Item>
					<PencilIcon />
					Edit
				</ContextMenu.Item>
				<ContextMenu.Item>
					<ShareIcon />
					Share
				</ContextMenu.Item>
			</ContextMenu.Group>
			<ContextMenu.Separator />
			<ContextMenu.Group>
				<ContextMenu.Item>
					<ArchiveIcon />
					Archive
				</ContextMenu.Item>
				<ContextMenu.Item variant="destructive">
					<TrashIcon />
					Delete
				</ContextMenu.Item>
			</ContextMenu.Group>
		</ContextMenu.Content>
	</ContextMenu.Root>
</Example>
