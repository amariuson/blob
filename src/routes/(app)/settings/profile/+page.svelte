<script lang="ts">
	import { toast } from 'svelte-sonner';

	import {
		SettingsCard,
		SettingsCardContent,
		SettingsCardFooter,
		SettingsCardHeader,
		SettingsRow
	} from '$features/settings';
	import {
		confirmImageUploadCommand,
		getUserProfileQuery,
		prepareImageUploadCommand,
		removeImageCommand,
		updateProfileForm
	} from '$features/settings/remote';
	import ImageUpload from '$lib/shared/components/image-upload.svelte';
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import { getInitials } from '$lib/shared/utils';

	import { format } from 'date-fns';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ImageIcon from '@lucide/svelte/icons/image';
	import KeyIcon from '@lucide/svelte/icons/key';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import MailIcon from '@lucide/svelte/icons/mail';
	import UserIcon from '@lucide/svelte/icons/user';

	function formatLongDate(date: Date | string): string {
		return format(new Date(date), 'MMMM d, yyyy');
	}

	// Image upload helpers bound to 'avatar' type
	async function getAvatarUploadUrl(data: {
		contentType: 'image/png' | 'image/jpeg' | 'image/webp';
		fileSize: number;
	}) {
		return prepareImageUploadCommand({
			type: 'avatar',
			contentType: data.contentType,
			size: data.fileSize
		});
	}

	async function confirmAvatarUpload(data: { key: string }) {
		return confirmImageUploadCommand({ type: 'avatar', key: data.key });
	}

	async function removeAvatar() {
		return removeImageCommand({ type: 'avatar' });
	}
</script>

<svelte:head>
	<title>Profile Settings</title>
</svelte:head>

<div class="space-y-4">
	<svelte:boundary>
		{#snippet pending()}
			<SettingsCard>
				<SettingsCardContent class="flex items-center gap-2 text-muted-foreground">
					<LoaderIcon class="size-4 animate-spin" />
					Loading profile...
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{#snippet failed(error)}
			<SettingsCard>
				<SettingsCardContent>
					<p class="text-destructive">
						Failed to load profile: {error instanceof Error ? error.message : 'Unknown error'}
					</p>
				</SettingsCardContent>
			</SettingsCard>
		{/snippet}

		{@const profile = await getUserProfileQuery()}

		<!-- Profile Overview Card -->
		<SettingsCard>
			<SettingsCardContent class="flex items-center gap-4">
				<Avatar.Root class="size-16 shrink-0 shadow-sm ring-2 ring-background">
					<Avatar.Image src={profile.image ?? ''} alt={profile.name} class="object-cover" />
					<Avatar.Fallback class="text-lg font-medium">
						{getInitials(profile.name)}
					</Avatar.Fallback>
				</Avatar.Root>
				<div class="min-w-0 flex-1">
					<h3 class="font-semibold">{profile.name}</h3>
					<p class="text-sm text-muted-foreground">{profile.email}</p>
					{#if profile.providers.length > 0}
						<div class="mt-2 flex flex-wrap gap-1.5">
							{#each profile.providers as provider (provider.providerId)}
								<Badge variant="secondary" class="text-xs capitalize">{provider.providerId}</Badge>
							{/each}
						</div>
					{/if}
				</div>
				{#if profile.emailVerified}
					<Badge
						variant="outline"
						class="shrink-0 border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
					>
						<CheckIcon class="mr-1 size-3" />
						Verified
					</Badge>
				{:else}
					<Badge variant="outline" class="shrink-0 text-xs">Unverified</Badge>
				{/if}
			</SettingsCardContent>
		</SettingsCard>

		<!-- Personal Information Form -->
		<SettingsCard>
			<form
				{...formHandler(updateProfileForm, {
					onSuccess: () => {
						toast.success('Profile updated successfully');
					},
					resetOnSuccess: false
				})}
			>
				<SettingsCardHeader
					title="Personal Information"
					description="Update your display name and contact details."
					icon={UserIcon}
					iconClass="bg-blue-500/10 text-blue-600 dark:text-blue-400"
				/>
				<SettingsCardContent class="space-y-4">
					<div class="grid gap-4 sm:grid-cols-2">
						<div class="space-y-2">
							<Label for="name">Display Name</Label>
							<Input id="name" name="name" value={profile.name} placeholder="Your display name" />
							{#if updateProfileForm.fields.name.issues()?.length}
								<p class="text-sm text-destructive">
									{updateProfileForm.fields.name.issues()?.[0]?.message}
								</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Label>Email Address</Label>
							<Input value={profile.email} disabled class="bg-muted/50" />
						</div>
					</div>
					<p class="text-xs text-muted-foreground">
						Your email is managed through your authentication provider and cannot be changed here.
					</p>
				</SettingsCardContent>
				<SettingsCardFooter>
					<Button type="submit" size="sm" disabled={!!updateProfileForm.pending}>
						{#if updateProfileForm.pending}
							<LoaderIcon class="size-4 animate-spin" />
							Saving...
						{:else}
							Save Changes
						{/if}
					</Button>
				</SettingsCardFooter>
			</form>
		</SettingsCard>

		<!-- Account Details Card -->
		<SettingsCard>
			<SettingsCardHeader
				title="Account Details"
				description="Information about your account."
				icon={KeyIcon}
				iconClass="bg-violet-500/10 text-violet-600 dark:text-violet-400"
			/>
			<SettingsCardContent noPadding>
				<div class="divide-y">
					<SettingsRow
						title="Member Since"
						description={formatLongDate(profile.createdAt)}
						icon={CalendarIcon}
						iconClass="bg-muted text-muted-foreground"
					/>
					<SettingsRow
						title="Email Status"
						icon={MailIcon}
						iconClass="bg-muted text-muted-foreground"
					>
						{#if profile.emailVerified}
							<Badge
								variant="outline"
								class="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-600 dark:text-emerald-400"
								>Verified</Badge
							>
						{:else}
							<Badge variant="outline" class="text-xs">Unverified</Badge>
						{/if}
					</SettingsRow>
				</div>
			</SettingsCardContent>
		</SettingsCard>

		<!-- Profile Photo Card -->
		<SettingsCard>
			<SettingsCardHeader
				title="Profile Photo"
				description="Upload a custom avatar or use your connected account photo."
				icon={ImageIcon}
				iconClass="bg-pink-500/10 text-pink-600 dark:text-pink-400"
			/>
			<SettingsCardContent>
				<ImageUpload
					imageUrl={profile.image}
					cropShape="round"
					label="Profile Photo"
					name={profile.name}
					hasCustomImage={profile.hasCustomImage}
					getUploadUrl={getAvatarUploadUrl}
					confirmUpload={confirmAvatarUpload}
					removeImage={removeAvatar}
					onSuccess={async () => {
						await getUserProfileQuery();
					}}
				/>
			</SettingsCardContent>
		</SettingsCard>
	</svelte:boundary>
</div>
