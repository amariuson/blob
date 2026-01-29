<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';

	import { getStateLabel, getStatePlaceholder, requiresState } from '../../logic/countries';
	import { updateBillingInfoForm } from '../../remote';
	import type { BillingInfo } from '../../types';
	import CountryPicker from '../country-picker.svelte';
	import SettingsCard from '../settings-card.svelte';
	import SettingsCardContent from '../settings-card-content.svelte';
	import SettingsCardFooter from '../settings-card-footer.svelte';
	import SettingsCardHeader from '../settings-card-header.svelte';

	interface Props {
		billingInfo: BillingInfo;
	}

	let { billingInfo }: Props = $props();

	// svelte-ignore state_referenced_locally
	// Captures initial prop value as mutable form state
	let formState = $state({
		country: billingInfo.billingAddress?.country ?? null
	});
</script>

<form
	{...formHandler(updateBillingInfoForm, {
		onSuccess: () => {
			toast.success('Billing information saved');
		},
		resetOnSuccess: false
	})}
>
	<SettingsCard>
		<SettingsCardHeader
			title="Billing Information"
			description="Information used for invoices and receipts."
			icon={ReceiptIcon}
			iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
		/>
		<SettingsCardContent class="space-y-4">
			<div class="space-y-4">
				<Label>Billing Address</Label>

				<div class="space-y-2">
					<Label for="country" class="text-sm font-normal text-muted-foreground">Country</Label>
					<CountryPicker
						name="country"
						value={formState.country}
						onchange={(code) => (formState.country = code)}
					/>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2 sm:col-span-2">
						<Label for="line1" class="text-sm font-normal text-muted-foreground">
							Street Address
						</Label>
						<Input
							name="line1"
							value={billingInfo.billingAddress?.line1 ?? ''}
							placeholder="123 Main Street"
						/>
					</div>

					<div class="space-y-2 sm:col-span-2">
						<Label for="line2" class="text-sm font-normal text-muted-foreground">
							Apt, suite, etc.
						</Label>
						<Input
							name="line2"
							value={billingInfo.billingAddress?.line2 ?? ''}
							placeholder="Suite 100"
						/>
					</div>

					<div class="space-y-2">
						<Label for="city" class="text-sm font-normal text-muted-foreground">City</Label>
						<Input
							name="city"
							value={billingInfo.billingAddress?.city ?? ''}
							placeholder="San Francisco"
						/>
					</div>

					{#if requiresState(formState.country)}
						<div class="space-y-2">
							<Label for="state" class="text-sm font-normal text-muted-foreground">
								{getStateLabel(formState.country)}
							</Label>
							<Input
								name="state"
								value={billingInfo.billingAddress?.state ?? ''}
								placeholder={getStatePlaceholder(formState.country)}
							/>
						</div>
					{:else}
						<input type="hidden" name="state" value="" />
					{/if}

					<div class="space-y-2">
						<Label for="postalCode" class="text-sm font-normal text-muted-foreground">
							Postal Code
						</Label>
						<Input
							name="postalCode"
							value={billingInfo.billingAddress?.postalCode ?? ''}
							placeholder="94102"
						/>
					</div>
				</div>
			</div>
		</SettingsCardContent>
		<SettingsCardFooter>
			<Button type="submit" size="sm" disabled={!!updateBillingInfoForm.pending}>
				{#if updateBillingInfoForm.pending}
					<LoaderIcon class="size-4 animate-spin" />
					Saving...
				{:else}
					<CheckIcon class="size-4" />
					Save Billing Info
				{/if}
			</Button>
		</SettingsCardFooter>
	</SettingsCard>
</form>
