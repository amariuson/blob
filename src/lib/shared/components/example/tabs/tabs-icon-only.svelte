<script lang="ts">
	import * as Tabs from '$lib/shared/components/ui/tabs/index.js';

	import HomeIcon from '@lucide/svelte/icons/home';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';

	import Example from '../example.svelte';
</script>

<Example title="Icon Only">
	<Tabs.Root value="home">
		<Tabs.List>
			<Tabs.Trigger value="home">
				<HomeIcon />
			</Tabs.Trigger>
			<Tabs.Trigger value="search">
				<SearchIcon />
			</Tabs.Trigger>
			<Tabs.Trigger value="settings">
				<SettingsIcon />
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</Example>
