<script lang="ts">
	import { Checkbox } from '$lib/shared/components/ui/checkbox/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Checkbox">
	<Field.Field orientation="horizontal">
		<Checkbox id="label-demo-terms" />
		<Label for="label-demo-terms">Accept terms and conditions</Label>
	</Field.Field>
</Example>
