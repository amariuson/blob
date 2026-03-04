<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import CommandBasic from './command-basic.svelte';
	import CommandManyItems from './command-many-items.svelte';
	import CommandWithGroups from './command-with-groups.svelte';
	import CommandWithShortcuts from './command-with-shortcuts.svelte';
</script>

<ExampleWrapper>
	<CommandBasic />
	<CommandWithShortcuts />
	<CommandWithGroups />
	<CommandManyItems />
</ExampleWrapper>
