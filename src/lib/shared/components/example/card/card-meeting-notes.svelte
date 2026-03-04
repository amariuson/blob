<script lang="ts">
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';
	import * as Button from '$lib/shared/components/ui/button/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import CaptionsIcon from '@lucide/svelte/icons/captions';

	import Example from '../example.svelte';
</script>

<Example title="Meeting Notes">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title>Meeting Notes</Card.Title>
			<Card.Description>Transcript from the meeting with the client.</Card.Description>
			<Card.Action>
				<Button.Root variant="outline" size="sm">
					<CaptionsIcon data-icon="inline-start" />
					Transcribe
				</Button.Root>
			</Card.Action>
		</Card.Header>
		<Card.Content>
			<p>Client requested dashboard redesign with focus on mobile responsiveness.</p>
			<ol class="mt-4 flex list-decimal flex-col gap-2 pl-6">
				<li>New analytics widgets for daily/weekly metrics</li>
				<li>Simplified navigation menu</li>
				<li>Dark mode support</li>
				<li>Timeline: 6 weeks</li>
				<li>Follow-up meeting scheduled for next Tuesday</li>
			</ol>
		</Card.Content>
		<Card.Footer>
			<Avatar.Group>
				<Avatar.Root>
					<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
					<Avatar.Fallback>LR</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.Root>
					<Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
					<Avatar.Fallback>ER</Avatar.Fallback>
				</Avatar.Root>
				<Avatar.GroupCount>+8</Avatar.GroupCount>
			</Avatar.Group>
		</Card.Footer>
	</Card.Root>
</Example>
