<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Input } from '$lib/shared/components/ui/input/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Input">
	<Field.Field>
		<Label for="label-demo-username">Username</Label>
		<Input id="label-demo-username" placeholder="Username" />
	</Field.Field>
</Example>
