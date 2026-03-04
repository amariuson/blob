<script lang="ts">
	import * as AlertDialog from '$lib/shared/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Dialog from '$lib/shared/components/ui/dialog/index.js';

	import Example from '../example.svelte';
</script>

<Example title="In Dialog" class="items-center">
	<Dialog.Root>
		<Dialog.Trigger>
			<Button variant="outline">Open Dialog</Button>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Alert Dialog Example</Dialog.Title>
				<Dialog.Description>Click the button below to open an alert dialog.</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<AlertDialog.Root>
					<AlertDialog.Trigger>
						<Button>Open Alert Dialog</Button>
					</AlertDialog.Trigger>
					<AlertDialog.Content size="sm">
						<AlertDialog.Header>
							<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
							<AlertDialog.Description>
								This action cannot be undone. This will permanently delete your account and remove
								your data from our servers.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<AlertDialog.Action>Continue</AlertDialog.Action>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</Example>
