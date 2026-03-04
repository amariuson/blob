<script lang="ts">
	import * as Item from '$lib/shared/components/ui/item/index.js';
	import * as Select from '$lib/shared/components/ui/select/index.js';

	import Example from '../example.svelte';

	const plans = [
		{
			name: 'Starter',
			description: 'Perfect for individuals getting started.'
		},
		{
			name: 'Professional',
			description: 'Ideal for growing teams and businesses.'
		},
		{
			name: 'Enterprise',
			description: 'Advanced features for large organizations.'
		}
	];

	let plan = $state<(typeof plans)[number]['name'] | undefined>(plans[0].name);
	const selectedPlan = $derived(plans.find((p) => p.name === plan));
</script>

<Example title="Subscription Plan">
	<Select.Root type="single" bind:value={plan}>
		<Select.Trigger class="h-auto! w-72">
			<Item.Root size="xs" class="w-full p-0">
				<Item.Content class="gap-0">
					<Item.Title>{selectedPlan?.name}</Item.Title>
					<Item.Description class="text-xs">
						{selectedPlan?.description ?? ''}
					</Item.Description>
				</Item.Content>
			</Item.Root>
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each plans as plan (plan.name)}
					<Select.Item value={plan.name}>
						<Item.Root size="xs" class="w-full p-0">
							<Item.Content class="gap-0">
								<Item.Title>{plan.name}</Item.Title>
								<Item.Description class="text-xs">
									{plan.description}
								</Item.Description>
							</Item.Content>
						</Item.Root>
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</Example>
