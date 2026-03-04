<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Input from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<Field.Field>
		<Field.Label for="input-demo-disabled">Email</Field.Label>
		<Input.Root id="input-demo-disabled" type="email" placeholder="Email" disabled />
	</Field.Field>
</Example>
