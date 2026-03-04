<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { Button } from '$lib/shared/components/ui/button/index.js';

	import Example from '../example.svelte';
</script>

<Example title="With Description" class="items-center justify-center">
	<Button
		onclick={() =>
			toast('Event has been created', {
				description: 'Monday, January 3rd at 6:00pm'
			})}
		variant="outline"
		class="w-fit"
	>
		Show Toast
	</Button>
</Example>
