<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';

	import {
		acceptInvitationForm,
		createOrgOnboardingForm,
		declineInvitationForm,
		getUserInvitationsQuery
	} from '../remote';

	const invitations = await getUserInvitationsQuery();
</script>

{#each createOrgOnboardingForm.fields.allIssues() as issue (issue.message)}
	<div class="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
		{issue.message}
	</div>
{/each}

{#if invitations.length > 0}
	<div class="mb-8">
		<h2 class="mb-4 text-lg font-medium">You've been invited to:</h2>
		<div class="space-y-3">
			{#each invitations as invitation (invitation.id)}
				{@const accept = acceptInvitationForm.for(invitation.id)}
				{@const decline = declineInvitationForm.for(invitation.id)}
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">{invitation.organizationName}</Card.Title>
						<Card.Description>
							Invited as {invitation.role}
						</Card.Description>
					</Card.Header>
					<Card.Footer class="gap-2">
						<form {...formHandler(accept)}>
							<input {...accept.fields.invitationId.as('hidden', invitation.id)} />
							<Button type="submit" size="sm" disabled={!!accept.pending || !!decline.pending}>
								{accept.pending ? 'Joining...' : 'Join'}
							</Button>
						</form>
						<form {...formHandler(decline)}>
							<input {...decline.fields.invitationId.as('hidden', invitation.id)} />
							<Button
								type="submit"
								variant="outline"
								size="sm"
								disabled={!!accept.pending || !!decline.pending}
							>
								{decline.pending ? 'Declining...' : 'Decline'}
							</Button>
						</form>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
	</div>

	<div class="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
		<hr class="border-dashed" />
		<span class="text-xs text-muted-foreground">Or</span>
		<hr class="border-dashed" />
	</div>
{/if}

<div>
	<h2 class="mb-4 text-lg font-medium">Create your own organization</h2>
	<form {...formHandler(createOrgOnboardingForm)} class="space-y-4">
		<div class="space-y-2">
			<Label for="name">Organization name</Label>
			<Input
				{...createOrgOnboardingForm.fields.name.as('text')}
				id="name"
				placeholder="Acme Inc."
			/>
			{#each createOrgOnboardingForm.fields.name.issues() as issue (issue.message)}
				<p class="mt-1 text-sm text-destructive">{issue.message}</p>
			{/each}
		</div>
		<Button type="submit" class="w-full" disabled={!!createOrgOnboardingForm.pending}>
			Create Organization
		</Button>
	</form>
</div>
