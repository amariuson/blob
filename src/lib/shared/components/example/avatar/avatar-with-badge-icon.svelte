<script lang="ts">
	import * as Avatar from '$lib/shared/components/ui/avatar/index.js';

	import CheckIcon from '@lucide/svelte/icons/check';
	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="Badge with Icon">
	<div class="flex flex-wrap items-center gap-2">
		<Avatar.Root size="sm">
			<Avatar.Image src="https://github.com/pranathip.png" alt="@pranathip" />
			<Avatar.Fallback>PP</Avatar.Fallback>
			<Avatar.Badge>
				<PlusIcon />
			</Avatar.Badge>
		</Avatar.Root>
		<Avatar.Root>
			<Avatar.Image src="https://github.com/pranathip.png" alt="@pranathip" />
			<Avatar.Fallback>PP</Avatar.Fallback>
			<Avatar.Badge>
				<PlusIcon />
			</Avatar.Badge>
		</Avatar.Root>
		<Avatar.Root size="lg">
			<Avatar.Image src="https://github.com/pranathip.png" alt="@pranathip" />
			<Avatar.Fallback>PP</Avatar.Fallback>
			<Avatar.Badge>
				<PlusIcon />
			</Avatar.Badge>
		</Avatar.Root>
	</div>
	<div class="flex flex-wrap items-center gap-2">
		<Avatar.Root size="sm">
			<Avatar.Fallback>PP</Avatar.Fallback>
			<Avatar.Badge>
				<CheckIcon />
			</Avatar.Badge>
		</Avatar.Root>
		<Avatar.Root>
			<Avatar.Fallback>PP</Avatar.Fallback>
			<Avatar.Badge>
				<CheckIcon />
			</Avatar.Badge>
		</Avatar.Root>
		<Avatar.Root size="lg">
			<Avatar.Fallback>PP</Avatar.Fallback>
			<Avatar.Badge>
				<CheckIcon />
			</Avatar.Badge>
		</Avatar.Root>
	</div>
</Example>
