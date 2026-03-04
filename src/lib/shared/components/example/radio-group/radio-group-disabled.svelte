<script lang="ts">
	import * as Field from '$lib/shared/components/ui/field/index.js';
	import * as RadioGroup from '$lib/shared/components/ui/radio-group/index.js';

	import Example from '../example.svelte';
</script>

<Example title="Disabled">
	<RadioGroup.Root value="option2" disabled>
		<Field.Field orientation="horizontal">
			<RadioGroup.Item value="option1" id="disabled-1" />
			<Field.Label for="disabled-1" class="font-normal">Option 1</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<RadioGroup.Item value="option2" id="disabled-2" />
			<Field.Label for="disabled-2" class="font-normal">Option 2</Field.Label>
		</Field.Field>
		<Field.Field orientation="horizontal">
			<RadioGroup.Item value="option3" id="disabled-3" />
			<Field.Label for="disabled-3" class="font-normal">Option 3</Field.Label>
		</Field.Field>
	</RadioGroup.Root>
</Example>
