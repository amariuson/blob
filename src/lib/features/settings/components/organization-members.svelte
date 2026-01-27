<script lang="ts">
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { getInitials } from '$lib/shared/utils';

	import PlusIcon from '@lucide/svelte/icons/plus';
	import UsersIcon from '@lucide/svelte/icons/users';

	import { getRoleBadgeVariant, getRoleIcon } from '../logic';
	import type { MemberInfo } from '../types';
	import { SettingsCard, SettingsCardContent, SettingsCardHeader } from './index.js';

	interface Props {
		members: MemberInfo[];
		canManage: boolean;
		onInvite: () => void;
	}

	let { members, canManage, onInvite }: Props = $props();
</script>

<SettingsCard>
	<SettingsCardHeader
		title="Members"
		description="{members.length} {members.length === 1
			? 'member'
			: 'members'} in this organization"
		icon={UsersIcon}
		iconClass="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
	>
		{#snippet action()}
			{#if canManage}
				<Button variant="outline" size="sm" onclick={onInvite}>
					<PlusIcon class="size-4" />
					Invite
				</Button>
			{/if}
		{/snippet}
	</SettingsCardHeader>
	<SettingsCardContent noPadding>
		<div class="divide-y">
			{#each members as member (member.id)}
				{@const MemberRoleIcon = getRoleIcon(member.role)}
				<div
					class="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
				>
					<div class="flex items-center gap-3">
						<Avatar.Root class="size-8">
							<Avatar.Image src={member.image ?? ''} alt={member.name} />
							<Avatar.Fallback class="text-xs">
								{getInitials(member.name)}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<p class="truncate text-sm font-medium">{member.name}</p>
							<p class="truncate text-xs text-muted-foreground">{member.email}</p>
						</div>
					</div>
					<Badge variant={getRoleBadgeVariant(member.role)} class="shrink-0 text-xs">
						<MemberRoleIcon class="mr-1 size-3" />
						<span class="capitalize">{member.role}</span>
					</Badge>
				</div>
			{/each}
		</div>
	</SettingsCardContent>
</SettingsCard>
