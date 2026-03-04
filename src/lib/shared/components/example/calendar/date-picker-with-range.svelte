<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';
	import { RangeCalendar } from '$lib/shared/components/ui/range-calendar/index.js';

	import type { DateRange } from 'bits-ui';
	import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import Example from '../example.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	const currentDate = new CalendarDate(2022, 1, 20);
	let date = $state<DateRange | undefined>({
		start: currentDate,
		end: currentDate.add({ days: 20 })
	});
</script>

<Example title="Date Picker Range">
	<Field.Field class="mx-auto w-72">
		<Field.Label for="date-picker-range">Date Picker Range</Field.Label>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						id="date-picker-range"
						class="justify-start px-2.5 font-normal"
					>
						<CalendarIcon data-icon="inline-start" />
						{#if date?.start && date?.end}
							{df.format(date.start.toDate(getLocalTimeZone()))} - {df.format(
								date.end.toDate(getLocalTimeZone())
							)}
						{:else}
							Pick a date
						{/if}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<RangeCalendar bind:value={date} numberOfMonths={2} />
			</Popover.Content>
		</Popover.Root>
	</Field.Field>
</Example>
