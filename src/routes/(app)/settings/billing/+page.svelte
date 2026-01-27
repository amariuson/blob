<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	import { getActiveMemberQuery } from '$features/auth/remote';
	import {
		BillingInfoForm,
		SettingsCard,
		SettingsCardContent,
		SettingsCardFooter,
		SettingsCardHeader
	} from '$features/settings';
	import {
		createCheckoutForm,
		getBillingInfoQuery,
		openBillingPortalForm,
		refreshSubscriptionDataForm
	} from '$features/settings/remote';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import CheckIcon from '@lucide/svelte/icons/check';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import ZapIcon from '@lucide/svelte/icons/zap';

	// Roles that can manage billing
	const BILLING_MANAGE_ROLES = ['owner', 'admin'];
</script>

<svelte:head>
	<title>Billing Settings</title>
</svelte:head>

<div class="space-y-4">
	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading billing information...
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{#snippet failed(error)}
			<SettingsCard>
				<SettingsCardContent>
					<p class="text-destructive">
						Failed to load billing: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{@const [billingInfo, activeMember] = await Promise.all([
			getBillingInfoQuery(),
			getActiveMemberQuery()
		])}
		{@const canManage = BILLING_MANAGE_ROLES.includes(activeMember.role)}
		{@const hasProSubscription = (billingInfo.entitlements?.activeSubscriptions?.length ?? 0) > 0}

		<!-- Current Plan -->
		<SettingsCard>
			<SettingsCardHeader
				title="Current Plan"
				description="Your organization's subscription status"
			/>
			<SettingsCardContent>
				<div class="flex flex-wrap items-center gap-3">
					{#if hasProSubscription}
						<Badge class="bg-linear-to-r from-violet-500 to-purple-600 text-white">
							<SparklesIcon class="mr-1 size-3" />
							Pro
						</Badge>
						<span class="text-sm text-muted-foreground">Full access to all features</span>
					{:else}
						<Badge variant="secondary">Free</Badge>
						<span class="text-sm text-muted-foreground">Limited features</span>
					{/if}
				</div>
			</SettingsCardContent>
		</SettingsCard>

		<!-- Manage / Upgrade -->
		<SettingsCard>
			<SettingsCardHeader
				title={hasProSubscription ? 'Manage Subscription' : 'Upgrade to Pro'}
				description={hasProSubscription
					? 'Update payment method, change plan, or cancel'
					: 'Unlock all features with a Pro subscription'}
				icon={ZapIcon}
				iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
			/>
			<SettingsCardContent>
				{#if !hasProSubscription}
					<ul class="space-y-2 text-sm text-muted-foreground">
						<li class="flex items-center gap-2">
							<CheckIcon class="size-4 text-violet-500" />
							Unlimited projects
						</li>
						<li class="flex items-center gap-2">
							<CheckIcon class="size-4 text-violet-500" />
							Priority support
						</li>
						<li class="flex items-center gap-2">
							<CheckIcon class="size-4 text-violet-500" />
							Advanced analytics
						</li>
					</ul>
				{:else}
					<p class="text-sm text-muted-foreground">
						Access your billing portal to update payment methods, view invoices, or manage your
						subscription.
					</p>
				{/if}
			</SettingsCardContent>
			<SettingsCardFooter>
				{#if canManage}
					{#if hasProSubscription}
						<form {...formHandler(openBillingPortalForm)}>
							<Button type="submit" variant="outline" disabled={!!openBillingPortalForm.pending}>
								<CreditCardIcon class="size-4" />
								Manage Subscription
							</Button>
						</form>
					{:else}
						<form {...formHandler(createCheckoutForm)}>
							<Button type="submit" disabled={!!createCheckoutForm.pending}>
								<SparklesIcon class="size-4" />
								Upgrade to Pro
							</Button>
						</form>
					{/if}
				{:else}
					<p class="text-sm text-muted-foreground">
						Contact an organization admin to manage billing.
					</p>
				{/if}
			</SettingsCardFooter>
		</SettingsCard>

		<!-- Billing Information (Admin only) -->
		{#if canManage}
			<BillingInfoForm {billingInfo} />
		{/if}

		<!-- Refresh Subscription Data (Admin only) -->
		{#if canManage}
			<SettingsCard>
				<SettingsCardHeader
					title="Refresh Subscription Data"
					description="Sync your subscription status from Polar"
					icon={RefreshCwIcon}
					iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
				/>
				<SettingsCardContent>
					<p class="text-sm text-muted-foreground">
						If your subscription status appears out of date, you can manually refresh it from Polar.
						This will update your plan, benefits, and usage data.
					</p>
					{#if billingInfo.entitlements?.updatedAt}
						<p class="mt-2 text-xs text-muted-foreground">
							Last updated: {billingInfo.entitlements.updatedAt.toLocaleString()}
						</p>
					{/if}
				</SettingsCardContent>
				<SettingsCardFooter>
					<form
						{...formHandler(refreshSubscriptionDataForm, {
							onSuccess: async () => {
								toast.success('Subscription data refreshed');
								await invalidateAll();
							}
						})}
					>
						<Button
							type="submit"
							variant="outline"
							disabled={!!refreshSubscriptionDataForm.pending}
						>
							{#if refreshSubscriptionDataForm.pending}
								<LoaderIcon class="size-4 animate-spin" />
								Refreshing...
							{:else}
								<RefreshCwIcon class="size-4" />
								Refresh Data
							{/if}
						</Button>
					</form>
				</SettingsCardFooter>
			</SettingsCard>
		{/if}
	</svelte:boundary>
</div>
