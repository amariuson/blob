<script lang="ts">
	import { getActiveMemberQuery } from '$features/auth/remote';
	import { SettingsCard, SettingsCardContent } from '$features/settings';
	import {
		getOrganizationInvitationsQuery,
		getOrganizationMembersQuery,
		getOrganizationSettingsQuery
	} from '$features/settings/remote';

	import LoaderIcon from '@lucide/svelte/icons/loader';

	import Organization from './organization.svelte';
</script>

<svelte:head>
	<title>Organization Settings</title>
</svelte:head>

<div class="space-y-4">
	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading organization settings...
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{#snippet failed(error)}
			<SettingsCard>
				<SettingsCardContent>
					<p class="text-destructive">
						Failed to load settings: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{@const [org, members, activeMember, invitations] = await Promise.all([
			getOrganizationSettingsQuery(),
			getOrganizationMembersQuery(),
			getActiveMemberQuery(),
			getOrganizationInvitationsQuery()
		])}

		<Organization {org} {members} {activeMember} {invitations} />
	</svelte:boundary>
</div>
