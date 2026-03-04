<script lang="ts">
	import * as ContextMenu from '$lib/shared/components/ui/context-menu/index.js';

	import ClipboardPasteIcon from '@lucide/svelte/icons/clipboard-paste';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ScissorsIcon from '@lucide/svelte/icons/scissors';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<ContextMenu.Root>
		<ContextMenu.Trigger
			class="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
		>
			Right click here
		</ContextMenu.Trigger>
		<ContextMenu.Content>
			<ContextMenu.Group>
				<ContextMenu.Item>
					<CopyIcon />
					Copy
				</ContextMenu.Item>
				<ContextMenu.Item>
					<ScissorsIcon />
					Cut
				</ContextMenu.Item>
				<ContextMenu.Item>
					<ClipboardPasteIcon />
					Paste
				</ContextMenu.Item>
			</ContextMenu.Group>
			<ContextMenu.Separator />
			<ContextMenu.Group>
				<ContextMenu.Item variant="destructive">
					<TrashIcon />
					Delete
				</ContextMenu.Item>
			</ContextMenu.Group>
		</ContextMenu.Content>
	</ContextMenu.Root>
</Example>
