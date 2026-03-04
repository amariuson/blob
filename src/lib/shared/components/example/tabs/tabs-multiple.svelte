<script lang="ts">
	import * as Tabs from '$lib/shared/components/ui/tabs/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Multiple">
	<Tabs.Root value="overview">
		<Tabs.List>
			<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
			<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
			<Tabs.Trigger value="reports">Reports</Tabs.Trigger>
			<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</Example>
