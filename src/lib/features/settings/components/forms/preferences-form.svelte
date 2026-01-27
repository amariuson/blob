<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import * as Select from '$lib/shared/components/ui/select/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import { mode, setMode } from 'mode-watcher';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CheckIcon from '@lucide/svelte/icons/check';
	import GlobeIcon from '@lucide/svelte/icons/globe';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import PaletteIcon from '@lucide/svelte/icons/palette';

	import {
		COMMON_TIMEZONES,
		DATE_FORMATS,
		SUPPORTED_LANGUAGES,
		TIME_FORMATS
	} from '../../constants';
	import { updatePreferencesForm } from '../../remote';
	import SettingsCard from '../settings-card.svelte';
	import SettingsCardContent from '../settings-card-content.svelte';
	import SettingsCardFooter from '../settings-card-footer.svelte';
	import SettingsCardHeader from '../settings-card-header.svelte';

	interface Preferences {
		language: string;
		timezone: string;
		dateFormat: string;
		timeFormat: string;
	}

	interface Props {
		preferences: Preferences;
	}

	let { preferences }: Props = $props();

	// Local state for form fields - IIFE captures initial value
	let formState = $state((() => ({ ...preferences }))());

	// Theme is stored client-side via mode-watcher
	const currentMode = $derived(mode.current ?? 'system');

	function handleThemeChange(value: string | undefined) {
		if (value) {
			setMode(value as 'light' | 'dark' | 'system');
		}
	}

	function getLanguageLabel(value: string): string {
		return SUPPORTED_LANGUAGES.find((l) => l.value === value)?.label ?? 'Select language';
	}

	function getTimezoneLabel(value: string): string {
		return COMMON_TIMEZONES.find((t) => t.value === value)?.label ?? 'Select timezone';
	}

	function getDateFormatLabel(value: string): string {
		return DATE_FORMATS.find((d) => d.value === value)?.label ?? 'Select format';
	}

	function getTimeFormatLabel(value: string): string {
		return TIME_FORMATS.find((t) => t.value === value)?.label ?? 'Select format';
	}

	function getThemeLabel(value: string): string {
		const themes = [
			{ value: 'light', label: 'Light' },
			{ value: 'dark', label: 'Dark' },
			{ value: 'system', label: 'System' }
		];
		return themes.find((t) => t.value === value)?.label ?? 'System';
	}
</script>

<form
	{...formHandler(updatePreferencesForm, {
		onSuccess: () => {
			toast.success('Preferences saved successfully');
		},
		resetOnSuccess: false
	})}
	class="space-y-4"
>
	<input type="hidden" name="language" value={formState.language} />
	<input type="hidden" name="timezone" value={formState.timezone} />
	<input type="hidden" name="dateFormat" value={formState.dateFormat} />
	<input type="hidden" name="timeFormat" value={formState.timeFormat} />

	<!-- Appearance Card -->
	<SettingsCard>
		<SettingsCardHeader
			title="Appearance"
			description="Choose how the app looks to you."
			icon={PaletteIcon}
			iconClass="bg-pink-500/10 text-pink-600 dark:text-pink-400"
		/>
		<SettingsCardContent>
			<div class="space-y-2">
				<Label for="theme">Theme</Label>
				<Select.Root type="single" value={currentMode} onValueChange={handleThemeChange}>
					<Select.Trigger id="theme" class="w-full max-w-xs">
						{getThemeLabel(currentMode)}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="light">Light</Select.Item>
						<Select.Item value="dark">Dark</Select.Item>
						<Select.Item value="system">System</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</SettingsCardContent>
	</SettingsCard>

	<!-- Language & Region Card -->
	<SettingsCard>
		<SettingsCardHeader
			title="Language & Region"
			description="Set your language and regional preferences."
			icon={GlobeIcon}
			iconClass="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
		/>
		<SettingsCardContent>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="space-y-2">
					<Label for="language">Language</Label>
					<Select.Root type="single" bind:value={formState.language}>
						<Select.Trigger id="language" class="w-full">
							{getLanguageLabel(formState.language)}
						</Select.Trigger>
						<Select.Content>
							{#each SUPPORTED_LANGUAGES as lang (lang.value)}
								<Select.Item value={lang.value}>{lang.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="space-y-2">
					<Label for="timezone">Timezone</Label>
					<Select.Root type="single" bind:value={formState.timezone}>
						<Select.Trigger id="timezone" class="w-full">
							{getTimezoneLabel(formState.timezone)}
						</Select.Trigger>
						<Select.Content>
							{#each COMMON_TIMEZONES as tz (tz.value)}
								<Select.Item value={tz.value}>{tz.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</SettingsCardContent>
	</SettingsCard>

	<!-- Date & Time Format Card -->
	<SettingsCard>
		<SettingsCardHeader
			title="Date & Time Format"
			description="Choose how dates and times are displayed."
			icon={CalendarIcon}
			iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
		/>
		<SettingsCardContent>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="space-y-2">
					<Label for="dateFormat">Date Format</Label>
					<Select.Root type="single" bind:value={formState.dateFormat}>
						<Select.Trigger id="dateFormat" class="w-full">
							{getDateFormatLabel(formState.dateFormat)}
						</Select.Trigger>
						<Select.Content>
							{#each DATE_FORMATS as fmt (fmt.value)}
								<Select.Item value={fmt.value}>{fmt.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="space-y-2">
					<Label for="timeFormat">Time Format</Label>
					<Select.Root type="single" bind:value={formState.timeFormat}>
						<Select.Trigger id="timeFormat" class="w-full">
							{getTimeFormatLabel(formState.timeFormat)}
						</Select.Trigger>
						<Select.Content>
							{#each TIME_FORMATS as fmt (fmt.value)}
								<Select.Item value={fmt.value}>{fmt.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</SettingsCardContent>
		<SettingsCardFooter>
			<Button type="submit" size="sm" disabled={!!updatePreferencesForm.pending}>
				{#if updatePreferencesForm.pending}
					<LoaderIcon class="size-4 animate-spin" />
					Saving...
				{:else}
					<CheckIcon class="size-4" />
					Save Preferences
				{/if}
			</Button>
		</SettingsCardFooter>
	</SettingsCard>
</form>
