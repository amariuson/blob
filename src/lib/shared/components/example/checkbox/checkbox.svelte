<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import CheckboxBasic from './checkbox-basic.svelte';
	import CheckboxDisabled from './checkbox-disabled.svelte';
	import CheckboxGroup from './checkbox-group.svelte';
	import CheckboxInTable from './checkbox-in-table.svelte';
	import CheckboxInvalid from './checkbox-invalid.svelte';
	import CheckboxWithDescription from './checkbox-with-description.svelte';
	import CheckboxWithTitle from './checkbox-with-title.svelte';
</script>

<ExampleWrapper>
	<CheckboxBasic />
	<CheckboxWithDescription />
	<CheckboxInvalid />
	<CheckboxDisabled />
	<CheckboxWithTitle />
	<CheckboxInTable />
	<CheckboxGroup />
</ExampleWrapper>
