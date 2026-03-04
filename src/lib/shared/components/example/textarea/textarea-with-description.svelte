<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Description">
	<Field.Field>
		<Field.Label for="textarea-demo-message-2">Message</Field.Label>
		<Textarea id="textarea-demo-message-2" placeholder="Type your message here." rows={6} />
		<Field.Description>Type your message and press enter to send.</Field.Description>
	</Field.Field>
</Example>
