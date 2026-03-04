<script lang="ts">
	import { buttonVariants } from '$lib/shared/components/ui/button/index.js';
	import * as ContextMenu from '$lib/shared/components/ui/context-menu/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';

	import ClipboardPasteIcon from '@lucide/svelte/icons/clipboard-paste';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ScissorsIcon from '@lucide/svelte/icons/scissors';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
	let open = $state(false);
</script>

<Example title="In Dialog">
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>Open Dialog</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Context Menu Example</Dialog.Title>
				<Dialog.Description>
					Right click on the area below to see the context menu.
				</Dialog.Description>
			</Dialog.Header>
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
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger>More Options</ContextMenu.SubTrigger>
						<ContextMenu.SubContent>
							<ContextMenu.Group>
								<ContextMenu.Item>Save Page...</ContextMenu.Item>
								<ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
								<ContextMenu.Item>Name Window...</ContextMenu.Item>
							</ContextMenu.Group>
							<ContextMenu.Separator />
							<ContextMenu.Group>
								<ContextMenu.Item>Developer Tools</ContextMenu.Item>
							</ContextMenu.Group>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
					<ContextMenu.Separator />
					<ContextMenu.Group>
						<ContextMenu.Item variant="destructive">
							<TrashIcon />
							Delete
						</ContextMenu.Item>
					</ContextMenu.Group>
				</ContextMenu.Content>
			</ContextMenu.Root>
		</Dialog.Content>
	</Dialog.Root>
</Example>
