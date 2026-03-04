<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Label">
	<Field.Field>
		<Field.Label for="textarea-demo-message">Message</Field.Label>
		<Textarea id="textarea-demo-message" placeholder="Type your message here." rows={6} />
	</Field.Field>
</Example>
