<script lang="ts">
	import * as AlertDialog from '$lib/shared/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Group Chat Dialog" class="items-center justify-center">
	<AlertDialog.Root>
		<AlertDialog.Trigger>
			<Button>Start Group Chat</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Use ChatGPT together</AlertDialog.Title>
				<AlertDialog.Description>
					Add people to your chats to plan, share ideas, and get creative.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer class="flex-row items-center justify-between sm:justify-between">
				<a
					href="#/"
					class="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
				>
					Learn more
				</a>
				<div class="flex gap-2">
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>Start group chat</AlertDialog.Action>
				</div>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Example>
