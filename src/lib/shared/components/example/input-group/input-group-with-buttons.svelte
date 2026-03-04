<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';

	import CopyIcon from '@lucide/svelte/icons/copy';
	import TrashIcon from '@lucide/svelte/icons/trash';

	import Example from '../example.svelte';
</script>

<Example title="With Buttons">
	<Field.Group>
		<Field.Field>
			<Field.Label for="input-button-13">Button</Field.Label>
			<InputGroup.Root>
				<InputGroup.Input id="input-button-13" />
				<InputGroup.Addon>
					<InputGroup.Button>Default</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input id="input-button-14" />
				<InputGroup.Addon>
					<InputGroup.Button variant="outline">Outline</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input id="input-button-15" />
				<InputGroup.Addon>
					<InputGroup.Button variant="secondary">Secondary</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input id="input-button-16" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button variant="secondary">Button</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input id="input-button-17" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button size="icon-xs">
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input id="input-button-18" />
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button variant="secondary" size="icon-xs">
						<TrashIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</Field.Field>
	</Field.Group>
</Example>
