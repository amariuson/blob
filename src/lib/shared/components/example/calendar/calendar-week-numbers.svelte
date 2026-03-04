<script lang="ts">
	import { Calendar } from '$lib/shared/components/ui/calendar/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Week Numbers" class="justify-center">
	<Card.Root class="mx-auto w-fit p-0">
		<Card.Content class="p-0">
			<Calendar type="single" />
		</Card.Content>
	</Card.Root>
</Example>
