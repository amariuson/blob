<script lang="ts">
	import * as AlertDialog from '$lib/shared/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/shared/components/ui/button/index.js';

	import BluetoothIcon from '@lucide/svelte/icons/bluetooth';

	import Example from '../example.svelte';
</script>

<Example title="Small With Media" class="items-center">
	<AlertDialog.Root>
		<AlertDialog.Trigger>
			<Button variant="outline">Small (Media)</Button>
		</AlertDialog.Trigger>
		<AlertDialog.Content size="sm">
			<AlertDialog.Header>
				<AlertDialog.Media>
					<BluetoothIcon />
				</AlertDialog.Media>
				<AlertDialog.Title>Allow accessory to connect?</AlertDialog.Title>
				<AlertDialog.Description>
					Do you want to allow the USB accessory to connect to this device?
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Don't allow</AlertDialog.Cancel>
				<AlertDialog.Action>Allow</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</Example>
