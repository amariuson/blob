<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<Field.Field data-disabled={true}>
		<Label for="label-demo-disabled">Disabled</Label>
		<Input id="label-demo-disabled" placeholder="Disabled" disabled />
	</Field.Field>
</Example>
