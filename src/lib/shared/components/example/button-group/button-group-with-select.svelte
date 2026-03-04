<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import * as Select from '$lib/shared/components/ui/select/index.js';

	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';

	import Example from '../example.svelte';
	const currencyItems = [
		{ label: '$', value: '$' },
		{ label: '€', value: '€' },
		{ label: '£', value: '£' }
	];

	let currency = $state(currencyItems[0].value);
	const currencyLabel = $derived(
		currencyItems.find((item) => item.value === currency)?.label ?? '$'
	);
</script>

<Example title="With Select">
	<Field.Field>
		<Label for="amount">Amount</Label>
		<ButtonGroup>
			<Select.Root type="single" bind:value={currency}>
				<Select.Trigger>
					{currencyLabel}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						{#each currencyItems as item (item.value)}
							<Select.Item value={item.value} label={item.label}>
								{item.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Input placeholder="Enter amount to send" />
			<Button variant="outline">
				<ArrowRightIcon />
			</Button>
		</ButtonGroup>
	</Field.Field>
</Example>
