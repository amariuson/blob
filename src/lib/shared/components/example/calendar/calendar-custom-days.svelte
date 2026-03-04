<script lang="ts">
	import * as Card from '$lib/shared/components/ui/card/index.js';
	import { RangeCalendar } from '$lib/shared/components/ui/range-calendar/index.js';
	import CalendarDayButton from '$lib/shared/components/ui/range-calendar/range-calendar-day.svelte';

	import type { DateRange } from 'bits-ui';
	import { CalendarDate, getLocalTimeZone } from '@internationalized/date';

	import Example from '../example.svelte';

	const currentDate = new CalendarDate(2022, 1, 20);
	let date = $state<DateRange | undefined>({
		start: currentDate,
		end: currentDate.add({ days: 20 })
	});
</script>

<Example title="Custom Days">
	<Card.Root class="mx-auto w-fit p-0">
		<Card.Content class="p-0">
			<RangeCalendar
				bind:value={date}
				numberOfMonths={1}
				captionLayout="dropdown"
				class="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
			>
				{#snippet day({ day, outsideMonth })}
					{@const isWeekend =
						day.toDate(getLocalTimeZone()).getDay() === 0 ||
						day.toDate(getLocalTimeZone()).getDay() === 6}
					<CalendarDayButton>
						{day.day}
						{#if !outsideMonth}
							<span>{isWeekend ? '$120' : '$100'}</span>
						{/if}
					</CalendarDayButton>
				{/snippet}
			</RangeCalendar>
		</Card.Content>
	</Card.Root>
</Example>
