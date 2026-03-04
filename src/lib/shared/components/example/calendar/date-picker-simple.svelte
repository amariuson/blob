<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Calendar } from '$lib/shared/components/ui/calendar/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';

	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import Example from '../example.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let date = $state<DateValue | undefined>();
</script>

<Example title="Date Picker Simple">
	<Field.Field class="mx-auto w-72">
		<Field.Label for="date-picker-simple">Date</Field.Label>
		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						id="date-picker-simple"
						class="justify-start px-2.5 font-normal"
					>
						<CalendarIcon data-icon="inline-start" />
						{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<Calendar type="single" bind:value={date} />
			</Popover.Content>
		</Popover.Root>
	</Field.Field>
</Example>
