<script lang="ts">
	import * as Menubar from '$lib/shared/components/ui/menubar/index.js';

	import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';
	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import SaveIcon from '@lucide/svelte/icons/save';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					<FileIcon />
					New File <Menubar.Shortcut>⌘N</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>
					<FolderIcon />
					Open Folder
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>
					<SaveIcon />
					Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>More</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Group>
					<Menubar.Item>
						<CircleDashedIcon />
						Settings
					</Menubar.Item>
					<Menubar.Item>
						<CircleDashedIcon />
						Help
					</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Item variant="destructive">
						<CircleDashedIcon />
						Delete
					</Menubar.Item>
				</Menubar.Group>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</Example>
