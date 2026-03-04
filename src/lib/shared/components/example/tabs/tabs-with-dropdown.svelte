<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';
	import * as Tabs from '$lib/shared/components/ui/tabs/index.js';

	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';

	import Example from '../example.svelte';
</script>

<Example title="With Dropdown">
	<Tabs.Root value="overview">
		<div class="flex items-center justify-between">
			<Tabs.List>
				<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
				<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				<Tabs.Trigger value="reports">Reports</Tabs.Trigger>
			</Tabs.List>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="ghost" size="icon" class="size-8" {...props}>
							<MoreHorizontalIcon />
							<span class="sr-only">More options</span>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Export</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Archive</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>

		<div class="rounded-lg border p-4">
			<Tabs.Content value="overview">
				View your dashboard metrics and key performance indicators.
			</Tabs.Content>
			<Tabs.Content value="analytics">
				Detailed analytics and insights about your data.
			</Tabs.Content>
			<Tabs.Content value="reports">Generate and view custom reports.</Tabs.Content>
		</div>
	</Tabs.Root>
</Example>
