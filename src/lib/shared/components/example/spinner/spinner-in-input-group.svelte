<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as InputGroup from '$lib/shared/components/ui/input-group/index.js';
	import { Spinner } from '$lib/shared/components/ui/spinner/index.js';

	import Example from '../example.svelte';
</script>

<Example title="In Input Group">
	<Field.Field>
		<Field.Label for="input-group-spinner">Input Group</Field.Label>
		<InputGroup.Root>
			<InputGroup.Input id="input-group-spinner" />
			<InputGroup.Addon>
				<Spinner />
			</InputGroup.Addon>
		</InputGroup.Root>
	</Field.Field>
</Example>
