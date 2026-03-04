<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import Building2Icon from '@lucide/svelte/icons/building-2';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import WalletIcon from '@lucide/svelte/icons/wallet';

	import Example from '../example.svelte';
	let paymentMethod = $state('card');
</script>

<Example title="Radio with Icons">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Payment Method</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="min-w-56">
			<DropdownMenu.Group>
				<DropdownMenu.Label>Select Payment Method</DropdownMenu.Label>
				<DropdownMenu.RadioGroup bind:value={paymentMethod}>
					<DropdownMenu.RadioItem value="card">
						<CreditCardIcon />
						Credit Card
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="paypal">
						<WalletIcon />
						PayPal
					</DropdownMenu.RadioItem>
					<DropdownMenu.RadioItem value="bank">
						<Building2Icon />
						Bank Transfer
					</DropdownMenu.RadioItem>
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
