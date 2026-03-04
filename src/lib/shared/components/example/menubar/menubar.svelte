<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import MenubarBasic from './menubar-basic.svelte';
	import MenubarDestructive from './menubar-destructive.svelte';
	import MenubarFormat from './menubar-format.svelte';
	import MenubarInDialog from './menubar-in-dialog.svelte';
	import MenubarInsert from './menubar-insert.svelte';
	import MenubarWithCheckboxes from './menubar-with-checkboxes.svelte';
	import MenubarWithIcons from './menubar-with-icons.svelte';
	import MenubarWithRadio from './menubar-with-radio.svelte';
	import MenubarWithShortcuts from './menubar-with-shortcuts.svelte';
	import MenubarWithSubmenu from './menubar-with-submenu.svelte';
</script>

<ExampleWrapper>
	<MenubarBasic />
	<MenubarWithSubmenu />
	<MenubarWithCheckboxes />
	<MenubarWithRadio />
	<MenubarWithIcons />
	<MenubarWithShortcuts />
	<MenubarFormat />
	<MenubarInsert />
	<MenubarDestructive />
	<MenubarInDialog />
</ExampleWrapper>
