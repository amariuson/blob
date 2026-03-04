<script lang="ts">
	import * as Checkbox from '$lib/shared/components/ui/checkbox/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Description">
	<Field.Field orientation="horizontal">
		<Checkbox.Root id="terms-2" checked />
		<Field.Content>
			<Field.Label for="terms-2">Accept terms and conditions</Field.Label>
			<Field.Description>
				By clicking this checkbox, you agree to the terms and conditions.
			</Field.Description>
		</Field.Content>
	</Field.Field>
</Example>
