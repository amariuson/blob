<script lang="ts">
	import ExampleWrapper from '../example-wrapper.svelte';
	import SelectBasic from './select-basic.svelte';
	import SelectDisabled from './select-disabled.svelte';
	import SelectInDialog from './select-in-dialog.svelte';
	import SelectInline from './select-inline.svelte';
	import SelectInvalid from './select-invalid.svelte';
	import SelectItemAligned from './select-item-aligned.svelte';
	import SelectLargeList from './select-large-list.svelte';
	import SelectMultiple from './select-multiple.svelte';
	import SelectPlan from './select-plan.svelte';
	import SelectSizes from './select-sizes.svelte';
	import SelectWithButton from './select-with-button.svelte';
	import SelectWithField from './select-with-field.svelte';
	import SelectWithGroups from './select-with-groups.svelte';
	import SelectWithIcons from './select-with-icons.svelte';
</script>

<ExampleWrapper>
	<SelectBasic />
	<SelectWithIcons />
	<SelectWithGroups />
	<SelectLargeList />
	<SelectMultiple />
	<SelectSizes />
	<SelectPlan />
	<SelectWithButton />
	<SelectItemAligned />
	<SelectWithField />
	<SelectInvalid />
	<SelectInline />
	<SelectDisabled />
	<SelectInDialog />
</ExampleWrapper>
