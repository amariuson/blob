<script lang="ts">
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import { RangeCalendar } from '$lib/shared/components/ui/range-calendar/index.js';

	import Example from '../example.svelte';
</script>

<Example
	title="Range Multiple Months"
	containerClass="lg:col-span-full 2xl:col-span-full"
	class="p-12"
>
	<Card.Root class="mx-auto w-fit p-0">
		<Card.Content class="p-0">
			<RangeCalendar numberOfMonths={3} locale="es" fixedWeeks />
		</Card.Content>
	</Card.Root>
</Example>
