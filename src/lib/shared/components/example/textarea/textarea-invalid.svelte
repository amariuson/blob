<script lang="ts">
	import { Textarea } from '$lib/shared/components/ui/textarea/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Invalid">
	<Textarea placeholder="Type your message here." aria-invalid="true" />
</Example>
