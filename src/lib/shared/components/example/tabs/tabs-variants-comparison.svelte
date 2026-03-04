<script lang="ts">
	import * as Tabs from '$lib/shared/components/ui/tabs/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Variants Alignment">
	<div class="flex gap-4">
		<Tabs.Root value="overview">
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
		<Tabs.Root value="overview">
			<Tabs.List variant="line">
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>
</Example>
