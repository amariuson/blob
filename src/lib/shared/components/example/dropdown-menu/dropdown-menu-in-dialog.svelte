<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

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
				<Dialog.Title>Dropdown Menu Example</Dialog.Title>
				<Dialog.Description>Click the button below to see the dropdown menu.</Dialog.Description>
			</Dialog.Header>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" class="w-fit" {...props}>Open Menu</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item>
						<CopyIcon />
						Copy
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<ScissorsIcon />
						Cut
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<ClipboardPasteIcon />
						Paste
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>More Options</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.Item>Save Page...</DropdownMenu.Item>
							<DropdownMenu.Item>Create Shortcut...</DropdownMenu.Item>
							<DropdownMenu.Item>Name Window...</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>Developer Tools</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
					<DropdownMenu.Separator />
					<DropdownMenu.Item variant="destructive">
						<TrashIcon />
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Dialog.Content>
	</Dialog.Root>
</Example>
