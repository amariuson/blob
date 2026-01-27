<script lang="ts">
	import type { Component } from 'svelte';
	import { toast } from 'svelte-sonner';

	import type { ActiveMember } from '$features/auth';
	import type { InvitationInfo, MemberInfo, OrganizationSettings } from '$features/settings';
	import {
		SettingsCard,
		SettingsCardContent,
		SettingsCardFooter,
		SettingsCardHeader,
		SettingsRow
	} from '$features/settings';
	import { InviteMemberForm } from '$features/settings';
	import {
		cancelInvitationForm,
		confirmImageUploadCommand,
		getOrganizationSettingsQuery,
		prepareImageUploadCommand,
		removeImageCommand,
		updateOrganizationForm
	} from '$features/settings/remote';
	import ImageUpload from '$lib/shared/components/image-upload.svelte';
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import { getInitials } from '$lib/shared/utils';

	import { format, formatDistanceToNow } from 'date-fns';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CrownIcon from '@lucide/svelte/icons/crown';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import MailIcon from '@lucide/svelte/icons/mail';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SendIcon from '@lucide/svelte/icons/send';
	import ShieldIcon from '@lucide/svelte/icons/shield';
	import UserIcon from '@lucide/svelte/icons/user';
	import UsersIcon from '@lucide/svelte/icons/users';
	import XIcon from '@lucide/svelte/icons/x';

	interface Props {
		org: OrganizationSettings;
		members: MemberInfo[];
		activeMember: NonNullable<ActiveMember>;
		invitations: InvitationInfo[];
	}

	let { org, members, activeMember, invitations }: Props = $props();

	let inviteDialogOpen = $state(false);

	// Roles that can manage org
	const ORG_MANAGE_ROLES = ['owner', 'admin'];

	const canManage = $derived(ORG_MANAGE_ROLES.includes(activeMember.role));
	const RoleIcon = $derived(getRoleIcon(activeMember.role));

	function formatDate(date: Date | string): string {
		return format(new Date(date), 'MMM d, yyyy');
	}

	function formatRelativeTime(date: Date | string): string {
		return formatDistanceToNow(new Date(date), { addSuffix: true });
	}

	function getRoleIcon(role: string): Component {
		switch (role) {
			case 'owner':
				return CrownIcon;
			case 'admin':
				return ShieldIcon;
			default:
				return UserIcon;
		}
	}

	function getRoleBadgeVariant(role: string): 'default' | 'secondary' | 'outline' {
		switch (role) {
			case 'owner':
				return 'default';
			case 'admin':
				return 'secondary';
			default:
				return 'outline';
		}
	}

	// Image upload helpers bound to 'org-logo' type
	async function getOrgLogoUploadUrl(data: {
		contentType: 'image/png' | 'image/jpeg' | 'image/webp';
		fileSize: number;
	}) {
		return prepareImageUploadCommand({
			type: 'org-logo',
			contentType: data.contentType,
			size: data.fileSize
		});
	}

	async function confirmOrgLogoUpload(data: { key: string }) {
		return confirmImageUploadCommand({ type: 'org-logo', key: data.key });
	}

	async function removeOrgLogo() {
		return removeImageCommand({ type: 'org-logo' });
	}
</script>

<!-- Organization Logo Card -->
{#if canManage}
	<SettingsCard>
		<SettingsCardHeader
			title="Organization Logo"
			description="Upload a logo for your organization."
			icon={ImageIcon}
			iconClass="bg-purple-500/10 text-purple-600 dark:text-purple-400"
		/>
		<SettingsCardContent>
			<ImageUpload
				imageUrl={org.logo}
				cropShape="rect"
				label="Organization Logo"
				name={org.name}
				hasCustomImage={org.hasCustomLogo}
				getUploadUrl={getOrgLogoUploadUrl}
				confirmUpload={confirmOrgLogoUpload}
				removeImage={removeOrgLogo}
				onSuccess={async () => {
					await getOrganizationSettingsQuery();
				}}
			/>
		</SettingsCardContent>
	</SettingsCard>
{/if}

<!-- Organization Details -->
{#if canManage}
	<form
		{...formHandler(updateOrganizationForm, {
			onSuccess: () => {
				toast.success('Organization settings saved');
			},
			resetOnSuccess: false
		})}
	>
		<SettingsCard>
			<SettingsCardHeader
				title="General"
				description="Basic organization information."
				icon={BuildingIcon}
				iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
			/>
			<SettingsCardContent>
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-2">
						<Label for="name">Organization Name</Label>
						<Input name="name" value={org.name} placeholder="My Organization" />
						{#if updateOrganizationForm.fields.name.issues()?.length}
							<p class="text-sm text-destructive">
								{updateOrganizationForm.fields.name.issues()?.[0]?.message}
							</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="slug">URL Slug</Label>
						<Input name="slug" value={org.slug} placeholder="my-organization" />
						{#if updateOrganizationForm.fields.slug.issues()?.length}
							<p class="text-sm text-destructive">
								{updateOrganizationForm.fields.slug.issues()?.[0]?.message}
							</p>
						{/if}
					</div>

					<div class="space-y-2 sm:col-span-2">
						<Label for="email">Organization Email</Label>
						<Input
							name="email"
							type="email"
							value={org.email ?? ''}
							placeholder="contact@example.com"
						/>
						{#if updateOrganizationForm.fields.email.issues()?.length}
							<p class="text-sm text-destructive">
								{updateOrganizationForm.fields.email.issues()?.[0]?.message}
							</p>
						{/if}
					</div>
				</div>
			</SettingsCardContent>
			<SettingsCardFooter class="justify-between">
				<p class="text-sm text-muted-foreground">
					Created {formatDate(org.createdAt)}
				</p>
				<Button type="submit" size="sm" disabled={!!updateOrganizationForm.pending}>
					{#if updateOrganizationForm.pending}
						<LoaderIcon class="size-4 animate-spin" />
						Saving...
					{:else}
						<CheckIcon class="size-4" />
						Save Changes
					{/if}
				</Button>
			</SettingsCardFooter>
		</SettingsCard>
	</form>
{:else}
	<!-- Read-only view for non-admins -->
	<SettingsCard>
		<SettingsCardHeader
			title="Organization Details"
			description="Basic information about your organization."
		/>
		<SettingsCardContent>
			<div class="space-y-4">
				<dl class="grid gap-4 sm:grid-cols-2">
					<div class="space-y-1">
						<dt class="text-sm text-muted-foreground">Organization Name</dt>
						<dd class="font-medium">{org.name}</dd>
					</div>
					<div class="space-y-1">
						<dt class="text-sm text-muted-foreground">URL Slug</dt>
						<dd class="font-mono text-sm">{org.slug}</dd>
					</div>
					<div class="space-y-1">
						<dt class="text-sm text-muted-foreground">Organization Email</dt>
						<dd class="text-sm">{org.email ?? 'Not set'}</dd>
					</div>
					<div class="space-y-1">
						<dt class="text-sm text-muted-foreground">Created</dt>
						<dd class="text-sm">{formatDate(org.createdAt)}</dd>
					</div>
				</dl>
			</div>
		</SettingsCardContent>
	</SettingsCard>
{/if}

<!-- Members -->
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
				<Button variant="outline" size="sm" onclick={() => (inviteDialogOpen = true)}>
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

<!-- Pending Invitations (Admin only) -->
{#if canManage}
	<SettingsCard>
		<SettingsCardHeader
			title="Pending Invitations"
			description={invitations.length > 0
				? `${invitations.length} invitation${invitations.length === 1 ? '' : 's'} pending`
				: 'No pending invitations'}
			icon={SendIcon}
			iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
			class={invitations.length === 0 ? 'border-b-0' : ''}
		/>
		{#if invitations.length > 0}
			<SettingsCardContent noPadding>
				<div class="divide-y">
					{#each invitations as invitation (invitation.id)}
						{@const cancelForm = cancelInvitationForm.for(invitation.id)}
						<div
							class="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50"
						>
							<div class="flex items-center gap-3">
								<div class="flex size-8 items-center justify-center rounded-full bg-muted">
									<MailIcon class="size-4 text-muted-foreground" />
								</div>
								<div class="min-w-0">
									<p class="truncate text-sm font-medium">{invitation.email}</p>
									<div class="flex items-center gap-2 text-xs text-muted-foreground">
										<Badge variant="outline" class="text-xs capitalize">
											{invitation.role ?? 'member'}
										</Badge>
										<span class="flex items-center gap-1">
											<ClockIcon class="size-3" />
											{formatRelativeTime(invitation.expiresAt)}
										</span>
									</div>
								</div>
							</div>
							<form
								{...formHandler(cancelForm, {
									onSuccess: () => {
										toast.success('Invitation cancelled');
									}
								})}
							>
								<input type="hidden" name="invitationId" value={invitation.id} />
								<Button
									type="submit"
									variant="ghost"
									size="icon"
									disabled={!!cancelForm.pending}
									class="size-8 text-muted-foreground hover:text-destructive"
								>
									{#if cancelForm.pending}
										<LoaderIcon class="size-4 animate-spin" />
									{:else}
										<XIcon class="size-4" />
									{/if}
									<span class="sr-only">Cancel invitation</span>
								</Button>
							</form>
						</div>
					{/each}
				</div>
			</SettingsCardContent>
		{/if}
	</SettingsCard>
{/if}

<!-- Your Role -->
<SettingsCard>
	<SettingsRow
		title="Your Role"
		description={activeMember.role === 'owner'
			? 'Full access to settings and billing'
			: activeMember.role === 'admin'
				? 'Can manage members and settings'
				: 'Standard access to resources'}
		icon={BadgeCheckIcon}
		iconClass="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
	>
		<Badge variant={getRoleBadgeVariant(activeMember.role)} class="shrink-0 capitalize">
			<RoleIcon class="mr-1 size-3" />
			{activeMember.role}
		</Badge>
	</SettingsRow>
</SettingsCard>

<!-- Invite Member Dialog -->
{#if canManage}
	<InviteMemberForm bind:open={inviteDialogOpen} currentUserRole={activeMember.role} />
{/if}
