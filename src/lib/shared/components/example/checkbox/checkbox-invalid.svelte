<script lang="ts">
	import * as Checkbox from '$lib/shared/components/ui/checkbox/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Invalid">
	<Field.Field orientation="horizontal" data-invalid>
		<Checkbox.Root id="terms-3" aria-invalid />
		<Field.Label for="terms-3">Accept terms and conditions</Field.Label>
	</Field.Field>
</Example>
