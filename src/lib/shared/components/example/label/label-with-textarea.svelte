<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Label } from '$lib/shared/components/ui/label/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Textarea">
	<Field.Field>
		<Label for="label-demo-message">Message</Label>
		<Textarea id="label-demo-message" placeholder="Message" />
	</Field.Field>
</Example>
