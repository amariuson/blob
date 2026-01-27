<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Badge } from '$lib/shared/components/ui/badge/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import { cn } from '$lib/shared/utils.js';

	import { formatDistanceToNow } from 'date-fns';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import MailIcon from '@lucide/svelte/icons/mail';
	import SendIcon from '@lucide/svelte/icons/send';
	import XIcon from '@lucide/svelte/icons/x';

	import { cancelInvitationForm, getOrganizationInvitationsQuery } from '../remote/index.js';
	import type { InvitationInfo } from '../types';
	import { SettingsCard, SettingsCardContent, SettingsCardHeader } from './index.js';

	interface Props {
		invitations: InvitationInfo[];
	}

	let { invitations }: Props = $props();

	function formatRelativeTime(date: Date | string): string {
		return formatDistanceToNow(new Date(date), { addSuffix: true });
	}
</script>

<SettingsCard>
	<SettingsCardHeader
		title="Pending Invitations"
		description={invitations.length > 0
			? `${invitations.length} invitation${invitations.length === 1 ? '' : 's'} pending`
			: 'No pending invitations'}
		icon={SendIcon}
		iconClass="bg-amber-500/10 text-amber-600 dark:text-amber-400"
		class={cn(invitations.length === 0 && 'border-b-0')}
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
								onSuccess: async () => {
									toast.success('Invitation cancelled');
									await getOrganizationInvitationsQuery();
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
