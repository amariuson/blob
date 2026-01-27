<script lang="ts">
	import { PreferencesForm, SettingsCard, SettingsCardContent } from '$features/settings';
	import { getUserPreferencesQuery } from '$features/settings/remote';

	import LoaderIcon from '@lucide/svelte/icons/loader';
</script>

<svelte:head>
	<title>Preferences</title>
</svelte:head>

<div class="space-y-4">
	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading preferences...
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

		{@const preferences = await getUserPreferencesQuery()}
		<PreferencesForm {preferences} />
	</svelte:boundary>
</div>
