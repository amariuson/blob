<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import AlertTriangleIcon from '@lucide/svelte/icons/alert-triangle';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ShareIcon from '@lucide/svelte/icons/share';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import UserRoundXIcon from '@lucide/svelte/icons/user-round-x';
	import VolumeXIcon from '@lucide/svelte/icons/volume-x';

	import Example from '../example.svelte';
</script>

<Example title="With Dropdown">
	<div class="flex flex-col gap-4">
		<ButtonGroup>
			<Button variant="outline">Update</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="icon" {...props}>
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Disable</DropdownMenu.Item>
					<DropdownMenu.Item variant="destructive">Uninstall</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</ButtonGroup>
		<ButtonGroup>
			<Button variant="outline">Follow</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="icon" {...props}>
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-50">
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<VolumeXIcon />
							Mute Conversation
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<CheckIcon />
							Mark as Read
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<AlertTriangleIcon />
							Report Conversation
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<UserRoundXIcon />
							Block User
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<ShareIcon />
							Share Conversation
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<CopyIcon />
							Copy Conversation
						</DropdownMenu.Item>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item variant="destructive">
							<TrashIcon />
							Delete Conversation
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</ButtonGroup>
	</div>
</Example>
