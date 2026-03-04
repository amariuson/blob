<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<Field.Field>
		<Field.Label for="textarea-demo-disabled">Message</Field.Label>
		<Textarea id="textarea-demo-disabled" placeholder="Type your message here." disabled />
	</Field.Field>
</Example>
