<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';

	import Example from '../example.svelte';
	let position = $state('bottom');
</script>

<Example title="With Radio Group">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Radio Group</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Panel Position</DropdownMenu.Label>
				<DropdownMenu.RadioGroup bind:value={position}>
					<DropdownMenu.RadioItem value="top">
						<ArrowUpIcon />
						Top
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="bottom">
						<ArrowDownIcon />
						Bottom
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="right" disabled>
						<ArrowRightIcon />
						Right
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
