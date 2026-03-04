<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Input from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Description">
	<Field.Field>
		<Field.Label for="input-demo-username">Username</Field.Label>
		<Input.Root id="input-demo-username" type="text" placeholder="Enter your username" />
		<Field.Description>Choose a unique username for your account.</Field.Description>
	</Field.Field>
</Example>
