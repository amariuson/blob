<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Input from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Label">
	<Field.Field>
		<Field.Label for="input-demo-email">Email</Field.Label>
		<Input.Root id="input-demo-email" type="email" placeholder="name@example.com" />
	</Field.Field>
</Example>
