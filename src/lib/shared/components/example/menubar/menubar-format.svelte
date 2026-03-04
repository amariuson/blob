<script lang="ts">
	import * as Menubar from '$lib/shared/components/ui/menubar/index.js';

	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';

	import Example from '../example.svelte';
</script>

<Example title="Format">
	<Menubar.Root>
		<Menubar.Menu>
			<Menubar.Trigger>Format</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.Item>
					<BoldIcon />
					Bold <Menubar.Shortcut>⌘B</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>
					<ItalicIcon />
					Italic <Menubar.Shortcut>⌘I</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Item>
					<UnderlineIcon />
					Underline <Menubar.Shortcut>⌘U</Menubar.Shortcut>
				</Menubar.Item>
				<Menubar.Separator />
				<Menubar.CheckboxItem checked>Strikethrough</Menubar.CheckboxItem>
				<Menubar.CheckboxItem>Code</Menubar.CheckboxItem>
			</Menubar.Content>
		</Menubar.Menu>
		<Menubar.Menu>
			<Menubar.Trigger>View</Menubar.Trigger>
			<Menubar.Content>
				<Menubar.CheckboxItem>Show Ruler</Menubar.CheckboxItem>
				<Menubar.CheckboxItem checked>Show Grid</Menubar.CheckboxItem>
				<Menubar.Separator />
				<Menubar.Item inset>Zoom In</Menubar.Item>
				<Menubar.Item inset>Zoom Out</Menubar.Item>
			</Menubar.Content>
		</Menubar.Menu>
	</Menubar.Root>
</Example>
