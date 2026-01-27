<script lang="ts">
	import { NotificationsForm, SettingsCard, SettingsCardContent } from '$features/settings';
	import { getNotificationPreferencesQuery } from '$features/settings/remote';

	import LoaderIcon from '@lucide/svelte/icons/loader';
</script>

<svelte:head>
	<title>Notification Settings</title>
</svelte:head>

<div class="space-y-4">
	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading notification preferences...
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{#snippet failed(error)}
			<SettingsCard>
				<SettingsCardContent>
					<p class="text-destructive">
						Failed to load preferences: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{@const preferences = await getNotificationPreferencesQuery()}
		<NotificationsForm {preferences} />
	</svelte:boundary>
</div>
