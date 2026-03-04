<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import ActivityIcon from '@lucide/svelte/icons/activity';
	import LayoutIcon from '@lucide/svelte/icons/layout';
	import PanelLeftIcon from '@lucide/svelte/icons/panel-left';

	import Example from '../example.svelte';
	let showStatusBar = $state(true);
	let showActivityBar = $state(false);
	let showPanel = $state(false);
</script>

<Example title="With Checkboxes">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Checkboxes</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="min-w-40">
			<DropdownMenu.Group>
				<DropdownMenu.Label>Appearance</DropdownMenu.Label>
				<DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
					<LayoutIcon />
					Status Bar
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem bind:checked={showActivityBar} disabled>
					<ActivityIcon />
					Activity Bar
				</DropdownMenu.CheckboxItem>
				<DropdownMenu.CheckboxItem bind:checked={showPanel}>
					<PanelLeftIcon />
					Panel
				</DropdownMenu.CheckboxItem>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
