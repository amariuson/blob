<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';
	import * as Menubar from '$lib/shared/components/ui/menubar/index.js';

	import ClipboardPasteIcon from '@lucide/svelte/icons/clipboard-paste';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ScissorsIcon from '@lucide/svelte/icons/scissors';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
</script>

<Example title="In Dialog">
	<Dialog.Root>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Open Dialog</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Menubar Example</Dialog.Title>
				<Dialog.Description>Use the menubar below to see the menu options.</Dialog.Description>
			</Dialog.Header>
			<Menubar.Root>
				<Menubar.Menu>
					<Menubar.Trigger>File</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>
							<CopyIcon />
							Copy
						</Menubar.Item>
						<Menubar.Item>
							<ScissorsIcon />
							Cut
						</Menubar.Item>
						<Menubar.Item>
							<ClipboardPasteIcon />
							Paste
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>More Options</Menubar.SubTrigger>
							<Menubar.SubContent>
								<Menubar.Item>Save Page...</Menubar.Item>
								<Menubar.Item>Create Shortcut...</Menubar.Item>
								<Menubar.Item>Name Window...</Menubar.Item>
								<Menubar.Separator />
								<Menubar.Item>Developer Tools</Menubar.Item>
							</Menubar.SubContent>
						</Menubar.Sub>
						<Menubar.Separator />
						<Menubar.Item variant="destructive">
							<TrashIcon />
							Delete
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Edit</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>
							Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
						</Menubar.Item>
						<Menubar.Item>
							Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>
		</Dialog.Content>
	</Dialog.Root>
</Example>
