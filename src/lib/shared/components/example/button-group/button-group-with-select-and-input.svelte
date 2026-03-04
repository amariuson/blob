<script lang="ts">
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import * as Select from '$lib/shared/components/ui/select/index.js';

	import Example from '../example.svelte';

	const durationItems = [
		{ label: 'Hours', value: 'hours' },
		{ label: 'Days', value: 'days' },
		{ label: 'Weeks', value: 'weeks' }
	];

	let duration = $state(durationItems[0].value);
	const durationLabel = $derived(
		durationItems.find((item) => item.value === duration)?.label ?? 'Hours'
	);
</script>

<Example title="With Select and Input">
	<ButtonGroup>
		<Select.Root type="single" bind:value={duration}>
			<Select.Trigger id="duration">
				{durationLabel}
			</Select.Trigger>
			<Select.Content align="start">
				<Select.Group>
					{#each durationItems as item (item.value)}
						<Select.Item value={item.value} label={item.label}>
							{item.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Input />
	</ButtonGroup>
</Example>
