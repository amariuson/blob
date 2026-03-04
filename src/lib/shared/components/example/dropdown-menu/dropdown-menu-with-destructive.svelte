<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/shared/components/ui/dropdown-menu/index.js';

	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import ShareIcon from '@lucide/svelte/icons/share';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
</script>

<Example title="With Destructive Items">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" class="w-fit" {...props}>Actions</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Item>
				<PencilIcon />
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<ShareIcon />
				Share
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<ArchiveIcon />
				Archive
			</DropdownMenu.Item>
			<DropdownMenu.Item variant="destructive">
				<TrashIcon />
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Example>
