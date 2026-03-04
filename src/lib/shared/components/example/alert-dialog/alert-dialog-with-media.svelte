<script lang="ts">
	import * as AlertDialog from '$lib/shared/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import BluetoothIcon from '@lucide/svelte/icons/bluetooth';

	import Example from '../example.svelte';
</script>

<Example title="With Media" class="items-center">
	<AlertDialog.Root>
		<AlertDialog.Trigger>
			<Button variant="outline">Default (Media)</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Media>
					<BluetoothIcon />
				</AlertDialog.Media>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This will permanently delete your account and remove your data from our servers.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
				<AlertDialog.Action>Continue</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Example>
