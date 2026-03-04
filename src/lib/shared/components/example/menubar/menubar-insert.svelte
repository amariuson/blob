<script lang="ts">
	import * as Menubar from '$lib/shared/components/ui/menubar/index.js';

	import CheckIcon from '@lucide/svelte/icons/check';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LinkIcon from '@lucide/svelte/icons/link';
	import SearchIcon from '@lucide/svelte/icons/search';
	import TableIcon from '@lucide/svelte/icons/table';

	import Example from '../example.svelte';
</script>

<Example title="Insert">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>Insert</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Sub>
					<Menubar.SubTrigger>
						<ImageIcon />
						Media
					</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item>Image</Menubar.Item>
						<Menubar.Item>Video</Menubar.Item>
						<Menubar.Item>Audio</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Separator />
				<Menubar.Item>
					<LinkIcon />
					Link <Menubar.Shortcut>⌘K</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>
					<TableIcon />
					Table
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>Tools</Menubar.Trigger>
			<Menubar.Content class="w-44">
				<Menubar.Item>
					<SearchIcon />
					Find & Replace <Menubar.Shortcut>⌘F</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>
					<CheckIcon />
					Spell Check
				</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</Example>
