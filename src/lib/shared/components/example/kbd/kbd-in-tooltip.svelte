<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Kbd from '$lib/shared/components/ui/kbd/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import SaveIcon from '@lucide/svelte/icons/save';

	import Example from '../example.svelte';
</script>

<Example title="Tooltip">
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				<Button size="icon-sm" variant="outline" {...props}>
					<SaveIcon />
				</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content class="pr-1.5">
			<div class="flex items-center gap-2">
				Save Changes <Kbd.Root>S</Kbd.Root>
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Example>
