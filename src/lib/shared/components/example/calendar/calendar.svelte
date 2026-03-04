<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import CalendarBookedDates from './calendar-booked-dates.svelte';
	import CalendarCustomDays from './calendar-custom-days.svelte';
	import CalendarMultiple from './calendar-multiple.svelte';
	import CalendarRange from './calendar-range.svelte';
	import CalendarRangeMultipleMonths from './calendar-range-multiple-months.svelte';
	import CalendarSingle from './calendar-single.svelte';
	import CalendarWeekNumbers from './calendar-week-numbers.svelte';
	import CalendarWithPresets from './calendar-with-presets.svelte';
	import CalendarWithTime from './calendar-with-time.svelte';
	import DatePickerSimple from './date-picker-simple.svelte';
	import DataPickerWithDropdowns from './date-picker-with-dropdowns.svelte';
	import DatePickerWithRange from './date-picker-with-range.svelte';
</script>

<ExampleWrapper>
	<CalendarSingle />
	<CalendarMultiple />
	<CalendarWeekNumbers />
	<CalendarBookedDates />
	<CalendarRange />
	<CalendarRangeMultipleMonths />
	<CalendarWithTime />
	<CalendarWithPresets />
	<CalendarCustomDays />
	<DatePickerSimple />
	<DataPickerWithDropdowns />
	<DatePickerWithRange />
</ExampleWrapper>
