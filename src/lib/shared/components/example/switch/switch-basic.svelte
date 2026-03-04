<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Switch } from '$lib/shared/components/ui/switch/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Basic">
	<Field.Field orientation="horizontal">
		<Switch id="switch-basic" />
		<Field.Label for="switch-basic">Airplane Mode</Field.Label>
	</Field.Field>
</Example>
