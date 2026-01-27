<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { type ActiveMember, rolesWithPermission } from '$features/auth';
	import type { InvitationInfo, MemberInfo, OrganizationSettings } from '$features/settings';
	import {
		getRoleBadgeVariant,
		getRoleIcon,
		InviteMemberForm,
		OrganizationInvitations,
		OrganizationMembers,
		SettingsCard,
		SettingsCardContent,
		SettingsCardFooter,
		SettingsCardHeader,
		SettingsRow
	} from '$features/settings';
	import {
		confirmImageUploadCommand,
		getOrganizationSettingsQuery,
		prepareImageUploadCommand,
		removeImageCommand,
		updateOrganizationForm
	} from '$features/settings/remote';
	import ImageUpload from '$lib/shared/components/image-upload.svelte';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import { format } from 'date-fns';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ImageIcon from '@lucide/svelte/icons/image';
	import LoaderIcon from '@lucide/svelte/icons/loader';

	interface Props {
		org: OrganizationSettings;
		members: MemberInfo[];
		activeMember: NonNullable<ActiveMember>;
		invitations: InvitationInfo[];
	}

	let { org, members, activeMember, invitations }: Props = $props();

	let inviteDialogOpen = $state(false);

	const ORG_MANAGE_ROLES = rolesWithPermission('organization', 'update');

	const canManage = $derived(ORG_MANAGE_ROLES.includes(activeMember.role));
	const RoleIcon = $derived(getRoleIcon(activeMember.role));

	function formatDate(date: Date | string): string {
		return format(new Date(date), 'MMM d, yyyy');
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
<OrganizationMembers {members} {canManage} onInvite={() => (inviteDialogOpen = true)} />

<!-- Pending Invitations (Admin only) -->
{#if canManage}
	<OrganizationInvitations {invitations} />
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
