<script lang="ts">
	import * as Tabs from '$lib/shared/components/ui/tabs/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<Tabs.Root value="home">
		<Tabs.List>
			<Tabs.Trigger value="home">Home</Tabs.Trigger>
			<Tabs.Trigger value="settings" disabled>Disabled</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</Example>
