<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Form">
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Open Popover</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-64" align="start">
			<Popover.Header>
				<Popover.Title>Dimensions</Popover.Title>
				<Popover.Description>Set the dimensions for the layer.</Popover.Description>
			</Popover.Header>
			<Field.Group class="gap-4">
				<Field.Field orientation="horizontal">
					<Field.Label for="width" class="w-1/2">Width</Field.Label>
					<Input id="width" value="100%" />
				</Field.Field>
				<Field.Field orientation="horizontal">
					<Field.Label for="height" class="w-1/2">Height</Field.Label>
					<Input id="height" value="25px" />
				</Field.Field>
			</Field.Group>
		</Popover.Content>
	</Popover.Root>
</Example>
