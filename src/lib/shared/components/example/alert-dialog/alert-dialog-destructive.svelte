<script lang="ts">
	import * as AlertDialog from '$lib/shared/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import Trash2Icon from '@lucide/svelte/icons/trash-2';

	import Example from '../example.svelte';
</script>

<Example title="Destructive" class="items-center">
	<AlertDialog.Root>
		<AlertDialog.Trigger>
			<Button variant="destructive">Delete Chat</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content size="sm">
			<AlertDialog.Header>
				<AlertDialog.Media
					class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
				>
					<Trash2Icon />
				</AlertDialog.Media>
				<AlertDialog.Title>Delete chat?</AlertDialog.Title>
				<AlertDialog.Description>
					This will permanently delete this chat conversation. View
					<a href="#/">Settings</a> delete any memories saved during this chat.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel variant="ghost">Cancel</AlertDialog.Cancel>
				<AlertDialog.Action variant="destructive">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Example>
