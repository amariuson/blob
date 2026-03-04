<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { ButtonGroup } from '$lib/shared/components/ui/button-group/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import * as Tooltip from '$lib/shared/components/ui/tooltip/index.js';

	import AudioLinesIcon from '@lucide/svelte/icons/audio-lines';
	import PlusIcon from '@lucide/svelte/icons/plus';

	import Example from '../example.svelte';
</script>

<Example title="Nested">
	<ButtonGroup>
		<ButtonGroup>
			<Button variant="outline" size="icon">
				<PlusIcon />
			</Button>
		</ButtonGroup>
		<ButtonGroup>
			<InputGroup.Root>
				<InputGroup.Input placeholder="Send a message..." />
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<InputGroup.Addon align="inline-end" {...props}>
								<AudioLinesIcon />
							</InputGroup.Addon>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Voice Mode</Tooltip.Content>
				</Tooltip.Root>
			</InputGroup.Root>
		</ButtonGroup>
	</ButtonGroup>
</Example>
