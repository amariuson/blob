<script lang="ts">
	import * as Menubar from '$lib/shared/components/ui/menubar/index.js';

	import FileIcon from '@lucide/svelte/icons/file';
	import FolderIcon from '@lucide/svelte/icons/folder';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import UserIcon from '@lucide/svelte/icons/user';

	import Example from '../example.svelte';
</script>

<Example title="Destructive">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>File</Menubar.Trigger>
			<Menubar.Content class="w-40">
				<Menubar.Item>
					<FileIcon />
					New File <Menubar.Shortcut>⌘N</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>
					<FolderIcon />
					Open Folder
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item variant="destructive">
					<TrashIcon />
					Delete File <Menubar.Shortcut>⌘⌫</Menubar.Shortcut>
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Account</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					<UserIcon />
					Profile
				</Menubar.Item>
				<Menubar.Item>
					<SettingsIcon />
					Settings
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item variant="destructive">
					<LogOutIcon />
					Sign out
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item variant="destructive">
					<TrashIcon />
					Delete
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</Example>
