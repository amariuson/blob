<script lang="ts">
	import { type PermissionMap, type RoleDefinition, roleDefinitions } from '$features/auth';
	import { SettingsCard, SettingsCardContent, SettingsCardHeader } from '$features/settings';
	import { cn } from '$lib/shared/utils';

	import CrownIcon from '@lucide/svelte/icons/crown';
	import KeyIcon from '@lucide/svelte/icons/key';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import UserIcon from '@lucide/svelte/icons/user';

	const roles: RoleDefinition[] = roleDefinitions;

	function getRoleIcon(roleName: string) {
		switch (roleName.toLowerCase()) {
			case 'owner':
				return CrownIcon;
			case 'admin':
				return ShieldIcon;
			default:
				return UserIcon;
		}
	}

	function getRoleIconClass(roleName: string): string {
		switch (roleName.toLowerCase()) {
			case 'owner':
				return 'text-amber-600 dark:text-amber-400';
			case 'admin':
				return 'text-blue-600 dark:text-blue-400';
			default:
				return 'text-muted-foreground';
		}
	}

	function summarizePermissions(permissions: PermissionMap): string {
		const capabilities: string[] = [];
		if (permissions.organization?.includes('delete')) capabilities.push('Delete org');
		else if (permissions.organization?.includes('update')) capabilities.push('Edit settings');
		if (permissions.member?.includes('create')) capabilities.push('Invite members');
		if (permissions.member?.includes('delete')) capabilities.push('Remove members');
		if (permissions.billing?.includes('manage')) capabilities.push('Manage billing');
		else if (permissions.billing?.includes('read')) capabilities.push('View billing');
		return capabilities.join(', ') || 'Read-only';
	}
</script>

<svelte:head>
	<title>Roles & Permissions</title>
</svelte:head>

<div class="space-y-4">
	<SettingsCard>
		<SettingsCardHeader
			title="Roles"
			description="System roles define what members can do in this organization"
			icon={KeyIcon}
			iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
		/>
		<SettingsCardContent>
			<div class="overflow-x-auto">
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b text-left">
							<th class="pr-4 pb-3 font-medium text-muted-foreground">Role</th>
							<th class="pr-4 pb-3 font-medium text-muted-foreground">Description</th>
							<th class="pb-3 font-medium text-muted-foreground">Capabilities</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each roles as role (role.name)}
							{@const RoleIcon = getRoleIcon(role.name)}
							<tr>
								<td class="py-3 pr-4">
									<div class="flex items-center gap-2">
										<RoleIcon class={cn('size-4', getRoleIconClass(role.name))} />
										<span class="font-medium capitalize">{role.name}</span>
									</div>
								</td>
								<td class="py-3 pr-4 text-muted-foreground">
									{role.description}
								</td>
								<td class="py-3 text-muted-foreground">
									{summarizePermissions(role.permissions)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</SettingsCardContent>
	</SettingsCard>
</div>
