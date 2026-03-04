<script lang="ts">
	import * as Tabs from '$lib/shared/components/ui/tabs/index.js';

	import AppWindowIcon from '@lucide/svelte/icons/app-window';
	import CodeIcon from '@lucide/svelte/icons/code';

	import Example from '../example.svelte';
</script>

<Example title="With Icons">
	<Tabs.Root value="preview">
		<Tabs.List>
			<Tabs.Trigger value="preview">
				<AppWindowIcon />
				Preview
			</Tabs.Trigger>
			<Tabs.Trigger value="code">
				<CodeIcon />
				Code
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</Example>
