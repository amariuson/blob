<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import RadioGroupBasic from './radio-group-basic.svelte';
	import RadioGroupDisabled from './radio-group-disabled.svelte';
	import RadioGroupGrid from './radio-group-grid.svelte';
	import RadioGroupInvalid from './radio-group-invalid.svelte';
	import RadioGroupWithDescriptions from './radio-group-with-descriptions.svelte';
	import RadioGroupWithFieldSet from './radio-group-with-field-set.svelte';
</script>

<ExampleWrapper>
	<RadioGroupBasic />
	<RadioGroupWithDescriptions />
	<RadioGroupWithFieldSet />
	<RadioGroupGrid />
	<RadioGroupDisabled />
	<RadioGroupInvalid />
</ExampleWrapper>
