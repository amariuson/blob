<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import ContextMenuBasic from './context-menu-basic.svelte';
	import ContextMenuInDialog from './context-menu-in-dialog.svelte';
	import ContextMenuWithCheckboxes from './context-menu-with-checkboxes.svelte';
	import ContextMenuWithDestructive from './context-menu-with-destructive.svelte';
	import ContextMenuWithGroups from './context-menu-with-groups.svelte';
	import ContextMenuWithIcons from './context-menu-with-icons.svelte';
	import ContextMenuWithRadio from './context-menu-with-radio.svelte';
	import ContextMenuWithShortcuts from './context-menu-with-shortcuts.svelte';
	import ContextMenuWithSides from './context-menu-with-sides.svelte';
	import ContextMenuWithSubmenu from './context-menu-with-submenu.svelte';
</script>

<ExampleWrapper>
	<ContextMenuBasic />
	<ContextMenuWithSides />
	<ContextMenuWithIcons />
	<ContextMenuWithShortcuts />
	<ContextMenuWithSubmenu />
	<ContextMenuWithGroups />
	<ContextMenuWithCheckboxes />
	<ContextMenuWithRadio />
	<ContextMenuWithDestructive />
	<ContextMenuInDialog />
</ExampleWrapper>
