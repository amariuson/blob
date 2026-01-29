<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Switch } from '$lib/shared/components/ui/switch/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import { cn } from '$lib/shared/utils.js';

	import BellIcon from '@lucide/svelte/icons/bell';
	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import MegaphoneIcon from '@lucide/svelte/icons/megaphone';
	import ShieldAlertIcon from '@lucide/svelte/icons/shield-alert';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	import { updateNotificationsForm } from '../../remote';
	import type { NotificationPreferences } from '../../types';
	import SettingsCard from '../settings-card.svelte';
	import SettingsCardContent from '../settings-card-content.svelte';
	import SettingsCardFooter from '../settings-card-footer.svelte';
	import SettingsCardHeader from '../settings-card-header.svelte';
	import SettingsRow from '../settings-row.svelte';

	interface Props {
		preferences: NotificationPreferences;
	}

	let { preferences }: Props = $props();

	// svelte-ignore state_referenced_locally
	// Captures initial prop value as mutable form state
	let formState = $state({ ...preferences });

	// svelte-ignore state_referenced_locally
	// Captures initial prop value to detect unsaved changes
	let savedValues = $state({ ...preferences });

	let hasChanges = $derived(
		formState.emailNotifications !== savedValues.emailNotifications ||
			formState.marketingEmails !== savedValues.marketingEmails ||
			formState.securityAlerts !== savedValues.securityAlerts ||
			formState.productUpdates !== savedValues.productUpdates
	);
</script>

<form
	{...formHandler(updateNotificationsForm, {
		onSuccess: () => {
			savedValues = { ...formState };
			toast.success('Notification preferences saved');
		},
		resetOnSuccess: false
	})}
	class="space-y-4"
>
	<input type="hidden" name="emailNotifications" value={formState.emailNotifications ? 'on' : ''} />
	<input type="hidden" name="marketingEmails" value={formState.marketingEmails ? 'on' : ''} />
	<input type="hidden" name="securityAlerts" value={formState.securityAlerts ? 'on' : ''} />
	<input type="hidden" name="productUpdates" value={formState.productUpdates ? 'on' : ''} />

	<!-- Master Toggle -->
	<SettingsCard class={cn(!formState.emailNotifications && 'opacity-75')}>
		<SettingsRow
			title="Email Notifications"
			description="Receive emails about your account"
			icon={BellIcon}
			iconClass="bg-primary/10 text-primary"
		>
			<Switch bind:checked={formState.emailNotifications} />
		</SettingsRow>
	</SettingsCard>

	<!-- Notification Categories -->
	<SettingsCard>
		<SettingsCardHeader
			title="Notification Preferences"
			description="Choose which types of notifications you'd like to receive."
		/>
		<SettingsCardContent noPadding>
			<div class="divide-y">
				<SettingsRow
					title="Security Alerts"
					description="Suspicious activity and security updates"
					icon={ShieldAlertIcon}
					iconClass="bg-orange-500/10 text-orange-600 dark:text-orange-400"
					disabled={!formState.emailNotifications}
				>
					<Switch
						bind:checked={formState.securityAlerts}
						disabled={!formState.emailNotifications}
					/>
				</SettingsRow>

				<SettingsRow
					title="Product Updates"
					description="New features and improvements"
					icon={SparklesIcon}
					iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
					disabled={!formState.emailNotifications}
				>
					<Switch
						bind:checked={formState.productUpdates}
						disabled={!formState.emailNotifications}
					/>
				</SettingsRow>

				<SettingsRow
					title="Marketing & Promotions"
					description="Tips, offers, and promotional content"
					icon={MegaphoneIcon}
					iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
					disabled={!formState.emailNotifications}
				>
					<Switch
						bind:checked={formState.marketingEmails}
						disabled={!formState.emailNotifications}
					/>
				</SettingsRow>
			</div>
		</SettingsCardContent>
		<SettingsCardFooter>
			<Button type="submit" size="sm" disabled={!!updateNotificationsForm.pending || !hasChanges}>
				{#if updateNotificationsForm.pending}
					<LoaderIcon class="size-4 animate-spin" />
					Saving...
				{:else if !hasChanges}
					<CheckIcon class="size-4" />
					Saved
				{:else}
					Save Preferences
				{/if}
			</Button>
		</SettingsCardFooter>
	</SettingsCard>
</form>
