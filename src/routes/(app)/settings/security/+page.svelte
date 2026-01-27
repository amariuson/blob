<script lang="ts">
	import { toast } from 'svelte-sonner';

	import {
		getProviderDisplayName,
		SettingsCard,
		SettingsCardContent,
		SettingsCardHeader,
		SettingsRow
	} from '$features/settings';
	import {
		getActiveSessionsQuery,
		getUserProfileQuery,
		revokeAllOtherSessionsForm,
		revokeSessionForm
	} from '$features/settings/remote';
	import ConfirmDialog from '$lib/shared/components/confirm-dialog.svelte';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { createConfirmation, formHandler } from '$lib/shared/form/form-handler.svelte';

	import { format } from 'date-fns';
	import KeyIcon from '@lucide/svelte/icons/key';
	import LaptopIcon from '@lucide/svelte/icons/laptop';
	import LinkIcon from '@lucide/svelte/icons/link';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import MonitorIcon from '@lucide/svelte/icons/monitor';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import SmartphoneIcon from '@lucide/svelte/icons/smartphone';
	import XIcon from '@lucide/svelte/icons/x';

	const confirmation = createConfirmation();

	function formatDateTime(date: Date | string): string {
		return format(new Date(date), 'MMM d, yyyy h:mm a');
	}
</script>

<svelte:head>
	<title>Security Settings</title>
</svelte:head>

<div class="space-y-4">
	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading security settings...
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{#snippet failed(error)}
			<SettingsCard>
				<SettingsCardContent>
					<p class="text-destructive">
						Failed to load: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{@const profile = await getUserProfileQuery()}

		<!-- Authentication Card -->
		<SettingsCard>
			<SettingsRow
				title="Authentication"
				description="Passwordless authentication"
				icon={ShieldCheckIcon}
				iconClass="bg-green-500/10 text-green-600 dark:text-green-400"
			>
				<div class="flex flex-wrap gap-1.5">
					{#each profile.providers as provider (provider.providerId)}
						<Badge variant="outline" class="gap-1 text-xs">
							<KeyIcon class="size-3" />
							{getProviderDisplayName(provider.providerId)}
						</Badge>
					{/each}
					<Badge variant="secondary" class="text-xs">OTP</Badge>
				</div>
			</SettingsRow>
		</SettingsCard>

		<!-- Connected Accounts Card -->
		<SettingsCard>
			<SettingsCardHeader
				title="Connected Accounts"
				description="External accounts linked to your profile."
				icon={LinkIcon}
				iconClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
			/>
			<SettingsCardContent noPadding>
				{#if profile.providers.length > 0}
					<div class="divide-y">
						{#each profile.providers as provider (provider.providerId)}
							<SettingsRow
								title={getProviderDisplayName(provider.providerId)}
								icon={KeyIcon}
								iconClass="bg-muted text-muted-foreground"
							>
								<Badge
									variant="outline"
									class="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
									>Connected</Badge
								>
							</SettingsRow>
						{/each}
					</div>
				{:else}
					<div class="px-4 py-3">
						<p class="text-sm text-muted-foreground">No external accounts connected.</p>
					</div>
				{/if}
			</SettingsCardContent>
		</SettingsCard>
	</svelte:boundary>

	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading sessions...
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{#snippet failed(error)}
			<SettingsCard>
				<SettingsCardContent>
					<p class="text-destructive">
						Failed to load sessions: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{@const sessions = await getActiveSessionsQuery()}

		<!-- Active Sessions Card -->
		<SettingsCard>
			<SettingsCardHeader
				title="Active Sessions"
				description="{sessions.length} {sessions.length === 1
					? 'session'
					: 'sessions'} across devices"
				icon={LaptopIcon}
				iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
			>
				{#snippet action()}
					{#if sessions.length > 1}
						<form
							{...formHandler(revokeAllOtherSessionsForm, {
								beforeSubmit: () =>
									confirmation.confirm({
										title: 'Sign out other sessions?',
										description:
											'This will sign you out of all other devices. Your current session will remain active.',
										confirmText: 'Sign Out All',
										variant: 'destructive'
									}),
								onSuccess: async () => {
									toast.success('All other sessions have been signed out');
									await getActiveSessionsQuery();
								},
								resetOnSuccess: false
							})}
						>
							<Button
								type="submit"
								variant="outline"
								size="sm"
								disabled={!!revokeAllOtherSessionsForm.pending}
							>
								{#if revokeAllOtherSessionsForm.pending}
									<LoaderIcon class="size-4 animate-spin" />
								{/if}
								Sign Out Others
							</Button>
						</form>
					{/if}
				{/snippet}
			</SettingsCardHeader>
			<SettingsCardContent noPadding>
				<div class="divide-y">
					{#each sessions as session (session.id)}
						{@const parsed = session.parsedUserAgent}
						{@const isMobile =
							parsed.device?.includes('Mobile') ||
							parsed.device?.includes('Phone') ||
							parsed.device?.includes('iPhone')}
						<div
							class="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
						>
							<div class="flex items-center gap-3">
								<div
									class="flex size-8 items-center justify-center rounded-md {session.isCurrent
										? 'bg-green-500/10'
										: 'bg-muted'}"
								>
									{#if isMobile}
										<SmartphoneIcon
											class="size-4 {session.isCurrent
												? 'text-green-600 dark:text-green-400'
												: 'text-muted-foreground'}"
										/>
									{:else}
										<MonitorIcon
											class="size-4 {session.isCurrent
												? 'text-green-600 dark:text-green-400'
												: 'text-muted-foreground'}"
										/>
									{/if}
								</div>
								<div class="min-w-0">
									<div class="flex items-center gap-2">
										<span class="text-sm font-medium"
											>{parsed.browser ?? 'Unknown'} on {parsed.device ?? 'Unknown'}</span
										>
										{#if session.isCurrent}
											<Badge
												variant="outline"
												class="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
												>Current</Badge
											>
										{/if}
									</div>
									<div class="text-xs text-muted-foreground">
										{#if session.ipAddress}
											{session.ipAddress} &bull;
										{/if}
										{formatDateTime(session.createdAt)}
									</div>
								</div>
							</div>
							{#if !session.isCurrent}
								{@const revokeForm = revokeSessionForm.for(session.id)}
								<form
									{...formHandler(revokeForm, {
										onSuccess: async () => {
											toast.success('Session revoked');
											await getActiveSessionsQuery();
										}
									})}
								>
									<input type="hidden" name="sessionId" value={session.id} />
									<Button
										type="submit"
										variant="ghost"
										size="icon"
										disabled={!!revokeForm.pending}
										class="size-8 text-muted-foreground hover:text-destructive"
									>
										{#if revokeForm.pending}
											<LoaderIcon class="size-4 animate-spin" />
										{:else}
											<XIcon class="size-4" />
										{/if}
										<span class="sr-only">Revoke session</span>
									</Button>
								</form>
							{/if}
						</div>
					{/each}
				</div>
			</SettingsCardContent>
		</SettingsCard>
	</svelte:boundary>
</div>

<ConfirmDialog {...confirmation.props} />
