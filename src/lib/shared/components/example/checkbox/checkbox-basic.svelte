<script lang="ts">
	import * as Checkbox from '$lib/shared/components/ui/checkbox/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<Field.Field orientation="horizontal">
		<Checkbox.Root id="terms" />
		<Field.Label for="terms">Accept terms and conditions</Field.Label>
	</Field.Field>
</Example>
