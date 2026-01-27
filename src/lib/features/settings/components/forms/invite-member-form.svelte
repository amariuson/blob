<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import * as Select from '$lib/shared/components/ui/select/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import LoaderIcon from '@lucide/svelte/icons/loader';
	import SendIcon from '@lucide/svelte/icons/send';

	import { getOrganizationInvitationsQuery, inviteMemberForm } from '../../remote';

	interface Props {
		open: boolean;
		currentUserRole: string;
	}

	let { open = $bindable(false), currentUserRole }: Props = $props();

	let selectedRole = $state<'member' | 'admin'>('member');

	// Available roles based on inviter's role:
	// Owner can invite: admin, member
	// Admin can invite: member only
	const availableRoles = $derived(
		currentUserRole === 'owner'
			? [
					{ value: 'member', label: 'Member' },
					{ value: 'admin', label: 'Admin' }
				]
			: [{ value: 'member', label: 'Member' }]
	);

	function getRoleLabel(value: string): string {
		return availableRoles.find((r) => r.value === value)?.label ?? 'Select role';
	}

	function resetForm() {
		selectedRole = 'member';
	}
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => !isOpen && resetForm()}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Invite Member</Dialog.Title>
			<Dialog.Description>Send an invitation to join your organization.</Dialog.Description>
		</Dialog.Header>
		<form
			{...formHandler(inviteMemberForm, {
				onSuccess: async () => {
					resetForm();
					open = false;
					toast.success('Invitation sent');
					await getOrganizationInvitationsQuery();
				}
			})}
			class="space-y-4"
		>
			<input type="hidden" name="role" value={selectedRole} />

			<div class="space-y-2">
				<Label for="email">Email address</Label>
				<Input id="email" name="email" type="email" placeholder="colleague@example.com" required />
				{#each inviteMemberForm.fields.email.issues() as issue (issue.message)}
					<p class="text-sm text-destructive">{issue.message}</p>
				{/each}
			</div>

			<div class="space-y-2">
				<Label for="role">Role</Label>
				<Select.Root type="single" bind:value={selectedRole}>
					<Select.Trigger id="role" class="w-full">
						{getRoleLabel(selectedRole)}
					</Select.Trigger>
					<Select.Content>
						{#each availableRoles as role (role.value)}
							<Select.Item value={role.value}>{role.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				{#each inviteMemberForm.fields.role.issues() as issue (issue.message)}
					<p class="text-sm text-destructive">{issue.message}</p>
				{/each}
			</div>

			<Dialog.Footer class="pt-4">
				<Button type="button" variant="outline" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit" disabled={!!inviteMemberForm.pending}>
					{#if inviteMemberForm.pending}
						<LoaderIcon class="size-4 animate-spin" />
						Sending...
					{:else}
						<SendIcon class="size-4" />
						Send Invitation
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
