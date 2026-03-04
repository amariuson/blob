<script lang="ts">
	import { Button } from '$lib/shared/components/ui/button/index.js';
	import { Calendar } from '$lib/shared/components/ui/calendar/index.js';
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as Popover from '$lib/shared/components/ui/popover/index.js';

	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';

	import Example from '../example.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let date = $state<DateValue | undefined>();
	let open = $state(false);
</script>

<Example title="Date Picker with Dropdowns">
	<Field.Field class="mx-auto w-72">
		<Popover.Root bind:open>
			<Field.Label for="date-picker-with-dropdowns-desktop">Date</Field.Label>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						id="date-picker-with-dropdowns-desktop"
						class="justify-start px-2.5 font-normal"
					>
						{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
						<ChevronDownIcon data-icon="inline-start" class="ml-auto" />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<Calendar type="single" bind:value={date} captionLayout="dropdown" />
				<div class="flex gap-2 border-t p-2">
					<Button variant="outline" size="sm" class="w-full" onclick={() => (open = false)}>
						Done
					</Button>
				</div>
			</Popover.Content>
		</Popover.Root>
	</Field.Field>
</Example>
