<script lang="ts">
	import * as Input from '$lib/shared/components/ui/input/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Invalid">
	<Input.Root type="text" placeholder="Error" aria-invalid="true" />
</Example>
