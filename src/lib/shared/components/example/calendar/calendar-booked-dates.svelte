<script lang="ts">
	import { Calendar } from '$lib/shared/components/ui/calendar/index.js';
	import * as Card from '$lib/shared/components/ui/card/index.js';

	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

	import Example from '../example.svelte';

	const currentDate = today(getLocalTimeZone());
	const bookedDates = Array.from(
		{ length: 15 },
		(_, i) => new CalendarDate(currentDate.year, 1, 12 + i)
	);
</script>

<Example title="Booked Dates">
	<Card.Root class="mx-auto w-fit p-0">
		<Card.Content class="p-0">
			<Calendar
				type="single"
				isDateUnavailable={(d) => bookedDates.some((bd) => bd.compare(d) === 0)}
			/>
		</Card.Content>
	</Card.Root>
</Example>
