<script lang="ts">
	import * as Select from '$lib/shared/components/ui/select/index.js';

	import ChartBarIcon from '@lucide/svelte/icons/chart-bar';
	import ChartLineIcon from '@lucide/svelte/icons/chart-line';
	import ChartPieIcon from '@lucide/svelte/icons/chart-pie';

	import Example from '../example.svelte';
	const items = $derived([
		{
			label: 'Line',
			value: 'line',
			icon: chartLineIcon
		},
		{
			label: 'Bar',
			value: 'bar',
			icon: chartBarIcon
		},
		{
			label: 'Pie',
			value: 'pie',
			icon: chartPieIcon
		}
	]);

	let selectedValue = $state<string | undefined>(undefined);
	const selectedItem = $derived(items.find((item) => item.value === selectedValue));
	const selectedLabel = $derived(selectedItem?.label ?? 'Chart Type');
</script>

<Example title="With Icons">
	<div class="flex flex-col gap-4">
		<Select.Root type="single" bind:value={selectedValue}>
			<Select.Trigger size="sm">
				{#if selectedItem}
					{@render selectedItem.icon()}
				{/if}
				{selectedLabel}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each items as item (item.value)}
						<Select.Item value={item.value}>
							{@render item.icon()}
							{item.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
		<Select.Root type="single" bind:value={selectedValue}>
			<Select.Trigger size="default">
				{#if selectedItem}
					{@render selectedItem.icon()}
				{/if}
				{selectedLabel}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each items as item (item.value)}
						<Select.Item value={item.value}>
							{@render item.icon()}
							{item.label}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</Example>

{#snippet chartLineIcon()}
	<ChartLineIcon />
{/snippet}

{#snippet chartBarIcon()}
	<ChartBarIcon />
{/snippet}

{#snippet chartPieIcon()}
	<ChartPieIcon />
{/snippet}
